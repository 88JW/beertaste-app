const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Funkcja do wysyłania powiadomień o postępie warzenia
exports.sendBrewingProgressNotifications = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();
  
  // Bieżąca godzina i minuty (w strefie czasowej UTC)
  const currentHour = new Date().getUTCHours();
  const currentMinute = new Date().getUTCMinutes();
  
  // Format aktualnej godziny jako "HH:MM" (np. "14:30")
  const currentHourString = currentHour.toString().padStart(2, '0');
  const currentMinuteString = currentMinute.toString().padStart(2, '0');
  const currentTime = `${currentHourString}:${currentMinuteString}`;
  
  console.log(`Rozpoczęcie sprawdzania powiadomień o godz. UTC ${currentTime}`);
  
  // Znajdź wszystkich użytkowników z aktywnymi powiadomieniami
  const usersSnapshot = await db.collection('users').get();
  
  let notificationsSent = 0;
  
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    
    // Pobierz wszystkie aktywne subskrypcje dla użytkownika
    const notificationsRef = db.collection('users').doc(userId).collection('notifications');
    const activeNotificationsSnapshot = await notificationsRef.where('enabled', '==', true).get();
    
    for (const notificationDoc of activeNotificationsSnapshot.docs) {
      const notificationData = notificationDoc.data();
      const warkaId = notificationData.warkaId;
      const frequencyDays = notificationData.frequencyDays || 3;
      const lastNotification = notificationData.lastNotification;
      const fcmToken = notificationData.token;
      
      // Pobierz ustawioną godzinę powiadomień (domyślnie 12:00)
      const notificationTime = notificationData.notificationTime || "12:00";
      
      // Sprawdź czy obecna godzina to wybrana godzina powiadomień
      // Porównujemy tylko godzinę (bez minut) dla większego marginesu
      // np. jeśli ustawiono 12:00, powiadomienie zostanie wysłane między 12:00 a 12:59
      const notificationHour = notificationTime.split(':')[0];
      
      if (currentHourString !== notificationHour) {
        // Pomiń powiadomienia, które nie powinny być wysłane o tej godzinie
        continue;
      }
      
      // Sprawdź czy należy wysłać powiadomienie (brak poprzedniego lub minął okres frequencyDays)
      let shouldSendNotification = false;
      
      if (!lastNotification) {
        shouldSendNotification = true;
      } else {
        const lastNotificationDate = lastNotification.toDate();
        const nextNotificationDate = new Date(lastNotificationDate);
        nextNotificationDate.setDate(lastNotificationDate.getDate() + frequencyDays);
        
        shouldSendNotification = new Date() >= nextNotificationDate;
      }
      
      if (shouldSendNotification && fcmToken) {
        try {
          // Pobierz dane warki
          const warkaRef = db.collection('dziennikiWarzenia').doc(warkaId);
          const warkaSnapshot = await warkaRef.get();
          
          if (warkaSnapshot.exists) {
            const warkaData = warkaSnapshot.data();
            const brewingDays = calculateBrewingDays(warkaData.dataNastawienia);
            
            if (brewingDays !== null) {
              // Wyślij powiadomienie
              await admin.messaging().send({
                token: fcmToken,
                notification: {
                  title: `🍺 Warka "${warkaData.nazwaWarki}" - ${brewingDays} dni warzenia!`,
                  body: `Twoja warka "${warkaData.nazwaWarki}" jest już warzona od ${brewingDays} dni. Sprawdź jej stan!`
                },
                data: {
                  warkaId: warkaId
                }
              });
              
              notificationsSent++;
              console.log(`Wysłano powiadomienie dla warki ${warkaId} użytkownika ${userId}`);
            }
          }
        } catch (error) {
          console.error(`Błąd podczas wysyłania powiadomienia dla warki ${warkaId}:`, error);
        }
      }
    }
  }
  
  console.log(`Ukończono wysyłanie powiadomień, wysłano: ${notificationsSent}`);
  return null;
});

// Funkcja pomocnicza do wyliczenia dni warzenia
function calculateBrewingDays(startDate) {
  try {
    if (!startDate) return null;
    
    let brewDate;
    if (startDate.seconds) {
      brewDate = new Date(startDate.seconds * 1000);
    } else if (startDate instanceof Date) {
      brewDate = startDate;
    } else if (typeof startDate === 'string') {
      brewDate = new Date(startDate);
    } else {
      return null;
    }
    
    const today = new Date();
    const diffTime = Math.abs(today - brewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.error("Error calculating brewing days:", error);
    return null;
  }
}
