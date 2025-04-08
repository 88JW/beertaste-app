import React, { useState, useEffect } from 'react';
import { 
  Paper, Typography, Box, Switch, FormControlLabel, 
  Button, IconButton, MenuItem, Select, FormControl, 
  InputLabel, Collapse, Tooltip, Grid, TextField
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth, requestNotificationPermission } from '../../../firebase';

const NotyfikacjeWarki = ({ 
  warkaId, 
  warkaName, 
  startDate,
  expandedSections, 
  toggleSection, 
  isMobile 
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [frequencyDays, setFrequencyDays] = useState(3);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);
  
  const [notificationTime, setNotificationTime] = useState("12:00");

  useEffect(() => {
    const checkNotificationStatus = async () => {
      try {
        if (!auth.currentUser) return;
        
        const userNotificationsRef = doc(db, 'users', auth.currentUser.uid, 'notifications', warkaId);
        const docSnap = await getDoc(userNotificationsRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNotificationsEnabled(data.enabled || false);
          setFrequencyDays(data.frequencyDays || 3);
          setLastNotification(data.lastNotification?.toDate() || null);
          setNotificationTime(data.notificationTime || "12:00");
        }
        
        if (Notification.permission === 'denied') {
          setPermissionDenied(true);
        }
      } catch (error) {
        console.error('Błąd podczas sprawdzania statusu powiadomień:', error);
      }
    };
    
    checkNotificationStatus();
  }, [warkaId]);
  
  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      await updateNotificationPreferences(false);
    } else {
      setIsSubscribing(true);
      const token = await requestNotificationPermission();
      setIsSubscribing(false);
      
      if (!token) {
        if (Notification.permission === 'denied') {
          setPermissionDenied(true);
        }
        return;
      }
      
      await updateNotificationPreferences(true, token);
    }
  };
  
  const updateNotificationPreferences = async (enabled, token = null) => {
    try {
      if (!auth.currentUser) return;
      
      const userNotificationsRef = doc(db, 'users', auth.currentUser.uid, 'notifications', warkaId);
      
      const notificationData = {
        warkaId,
        warkaName,
        enabled,
        frequencyDays,
        startDate,
        notificationTime,
        updatedAt: new Date(),
        lastNotification: lastNotification || null
      };
      
      if (token) {
        notificationData.token = token;
      }
      
      await setDoc(userNotificationsRef, notificationData, { merge: true });
      setNotificationsEnabled(enabled);
    } catch (error) {
      console.error('Błąd podczas aktualizacji preferencji powiadomień:', error);
    }
  };
  
  const handleFrequencyChange = async (event) => {
    const newFrequency = event.target.value;
    setFrequencyDays(newFrequency);
    
    if (notificationsEnabled) {
      try {
        const userNotificationsRef = doc(db, 'users', auth.currentUser.uid, 'notifications', warkaId);
        await updateDoc(userNotificationsRef, {
          frequencyDays: newFrequency
        });
      } catch (error) {
        console.error('Błąd podczas aktualizacji częstotliwości powiadomień:', error);
      }
    }
  };

  const handleTimeChange = async (event) => {
    const newTime = event.target.value;
    setNotificationTime(newTime);
    
    if (notificationsEnabled) {
      try {
        const userNotificationsRef = doc(db, 'users', auth.currentUser.uid, 'notifications', warkaId);
        await updateDoc(userNotificationsRef, {
          notificationTime: newTime
        });
      } catch (error) {
        console.error('Błąd podczas aktualizacji godziny powiadomień:', error);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 } }} className="no-print">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          Powiadomienia o warzeniu
        </Typography>
        <IconButton onClick={() => toggleSection('notifications')} size="small">
          {expandedSections.notifications ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      <Collapse in={expandedSections.notifications}>
        <Box sx={{ mt: 2, mb: 1 }}>
          {permissionDenied ? (
            <Box sx={{ bgcolor: 'warning.light', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="body1">
                Powiadomienia są zablokowane w przeglądarce. Zmień ustawienia przeglądarki, aby otrzymywać powiadomienia.
              </Typography>
            </Box>
          ) : (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                    disabled={isSubscribing}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 1 }}>
                      {notificationsEnabled ? "Powiadomienia włączone" : "Włącz powiadomienia"}
                    </Typography>
                    {notificationsEnabled ? 
                      <NotificationsActiveIcon color="primary" /> :
                      <NotificationsOffIcon color="disabled" />
                    }
                  </Box>
                }
              />
              
              {notificationsEnabled && (
                <>
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 2 }}>
                    <FormControl variant="outlined" size={isMobile ? "small" : "medium"} sx={{ minWidth: 200 }}>
                      <InputLabel>Częstotliwość powiadomień</InputLabel>
                      <Select
                        value={frequencyDays}
                        onChange={handleFrequencyChange}
                        label="Częstotliwość powiadomień"
                      >
                        <MenuItem value={1}>Co dzień</MenuItem>
                        <MenuItem value={2}>Co 2 dni</MenuItem>
                        <MenuItem value={3}>Co 3 dni</MenuItem>
                        <MenuItem value={7}>Co tydzień</MenuItem>
                        <MenuItem value={14}>Co 2 tygodnie</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Tooltip title="Powiadomienia będą wysyłane automatycznie w wybranej częstotliwości, informując o postępie warzenia">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1 }} /> Godzina powiadomień:
                    </Typography>
                    
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Godzina powiadomienia"
                          type="time"
                          value={notificationTime}
                          onChange={handleTimeChange}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ step: 300 }}
                          fullWidth
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Powiadomienie zostanie wysłane raz dziennie o wybranej godzinie
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
              
              {lastNotification && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Ostatnie powiadomienie: {lastNotification.toLocaleString()}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default NotyfikacjeWarki;
