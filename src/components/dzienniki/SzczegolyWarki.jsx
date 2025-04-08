import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  doc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, 
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useMediaQuery, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Importuj komponenty
import WarkaDetails from './szczegoly-warki/WarkaDetails';
import PomiarForm from './szczegoly-warki/PomiarForm';
import PrzebiegFermentacji from './szczegoly-warki/PrzebiegFermentacji';
import WarkaActions from './szczegoly-warki/WarkaActions';
import { printStyles } from './szczegoly-warki/utils';

function SzczegolyWarki() {
  const { id } = useParams();
  const [warka, setWarka] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataPomiaru, setDataPomiaru] = useState(new Date());
  const [formData, setFormData] = useState({
    blg: '',
    temperatura: '',
    piana: false,
    co2: false, 
    notatki: '',
  });
  const [przebiegFermentacji, setPrzebiegFermentacji] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nazwaWarki: '',
    dataNastawienia: '',
    rodzajPiwa: '',
    drozdze: '',
    chmiele: '',
    rodzajCukru: '',
    notatki: '',
  });
  
  // State dla rozwijanych sekcji
  const [expandedSections, setExpandedSections] = useState({
    details: !isMobile,
    addMeasurement: !isMobile,
    fermentationProgress: !isMobile
  });

  // Funkcja do przełączania rozwinięcia sekcji
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Pobierz przebieg fermentacji
  const getPrzebiegFermentacji = async () => {
    const przebiegFermentacjiCollection = collection(db, "dziennikiWarzenia", id, "przebiegFermentacji");
    const przebiegFermentacjiSnapshot = await getDocs(przebiegFermentacjiCollection);
    const przebiegFermentacjiList = przebiegFermentacjiSnapshot.docs.map((doc) => {
      const data = doc.data();
      const dataPomiaru = data.dataPomiaru ? new Date(data.dataPomiaru.seconds * 1000) : null;
      return {
        id: doc.id,
        ...data,
        dataPomiaru
      };
    }).sort((a, b) => (b.dataPomiaru || 0) - (a.dataPomiaru || 0));
    setPrzebiegFermentacji(przebiegFermentacjiList);
  };

  // Pobierz dane warki
  const fetchDziennik = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return navigate('/dzienniki/warzenia');
      const warkaRef = doc(db, 'dziennikiWarzenia', id);
      const docSnap = await getDoc(warkaRef);
      if (docSnap.exists()) {
        if (!docSnap.data()) return navigate('/dzienniki/warzenia')
        if(docSnap.data().userId === userId){
          setWarka(docSnap.data());
          getPrzebiegFermentacji();
        } else {
          setWarka(null)
        }
      } else {
        console.log('Nie znaleziono dokumentu!');  
      }
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDziennik();
  }, [id]);

  useEffect(() => {
    setExpandedSections(prev => ({
      details: !isMobile ? true : prev.details,
      addMeasurement: !isMobile ? true : prev.addMeasurement,
      fermentationProgress: !isMobile ? true : prev.fermentationProgress
    }));
  }, [isMobile]);

  useEffect(() => {
    if (warka) {
      setEditFormData({
        nazwaWarki: warka.nazwaWarki || '',
        dataNastawienia: warka.dataNastawienia || '',
        rodzajPiwa: warka.rodzajPiwa || '',
        drozdze: warka.drozdze || '',
        chmiele: warka.chmiele || '',
        rodzajCukru: warka.rodzajCukru || '',
        notatki: warka.notatki || '',
      });
    }
  }, [warka]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!warka) {
    return <div>Nie znaleziono warki.</div>;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;    

    if (name === 'dataPomiaru') {      
      setDataPomiaru(new Date(value));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const warkaRef = doc(db, 'dziennikiWarzenia', id);
      await updateDoc(warkaRef, editFormData);
      setWarka({...warka, ...editFormData});
      setIsEditing(false);
    } catch (error) {
      console.error('Błąd aktualizacji warki:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = {
        ...formData,
        dataPomiaru: Timestamp.fromDate(dataPomiaru),
      };

      const docRef = await addDoc(collection(db, 'dziennikiWarzenia', id, 'przebiegFermentacji'), data);
      
      const newPomiar = { 
        id: docRef.id, 
        ...formData, 
        dataPomiaru: new Date(dataPomiaru)
      };
      
      setFormData({ blg: '', temperatura: '', piana: false, co2: false, notatki: '' });
      setPrzebiegFermentacji((prevPrzebieg) => [newPomiar, ...prevPrzebieg]);
    } catch (error) {
      console.error('Błąd dodawania pomiaru:', error);
      alert(`Nie udało się dodać pomiaru: ${error.message}`);
    }
  };

  const handlePrint = () => {
    setExpandedSections({
      details: true,
      addMeasurement: true,
      fermentationProgress: true
    });
    
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleSaveAsRecipe = async () => {
    try {
      const recipeData = {
        nazwa: warka.nazwaWarki,
        rodzajPiwa: warka.rodzajPiwa,
        drozdze: warka.drozdze,
        chmiele: warka.chmiele,
        rodzajCukru: warka.rodzajCukru,
        notatki: warka.notatki,
        instrukcja: '',
        blg: przebiegFermentacji.length > 0 ? przebiegFermentacji[0].blg : '',
        dataDodania: Timestamp.now(),
        userId: auth.currentUser?.uid,
        zrodloWarkaId: id,
      };

      const requiredFields = ['nazwa', 'blg'];
      for (const field of requiredFields) {
        if (!recipeData[field]) {
          throw new Error(`Pole "${field}" jest wymagane`);
        }
      }

      const docRef = await addDoc(collection(db, 'receptury'), recipeData);
      alert('Receptura została zapisana!');
      navigate(`/receptury/${docRef.id}`);
    } catch (error) {
      console.error('Błąd zapisywania receptury:', error);
      alert(`Nie udało się zapisać receptury: ${error.message}`);
    }
  };

  const handleArchiveWarka = async () => {
    try {
      const archivedWarkaData = {
        ...warka,
        archiwizowano: Timestamp.now(),
        userId: auth.currentUser?.uid,
        warkaId: id,
      };

      const docRef = await addDoc(collection(db, 'archiwumWarzenia'), archivedWarkaData);
      alert('Warka została zarchiwizowana!');
    } catch (error) {
      console.error('Błąd archiwizacji warki:', error);
      alert(`Nie udało się zarchiwizować warki: ${error.message}`);
    }
  };

  const handleDeletePomiar = async (pomiarId) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten pomiar? Tej operacji nie można cofnąć.")) {
      try {
        await deleteDoc(doc(db, "dziennikiWarzenia", id, "przebiegFermentacji", pomiarId));
        setPrzebiegFermentacji(prevPrzebieg => 
          prevPrzebieg.filter(pomiar => pomiar.id !== pomiarId)
        );
        alert("Pomiar został usunięty.");
      } catch (error) {
        console.error("Błąd usuwania pomiaru:", error);
        alert(`Nie udało się usunąć pomiaru: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <style>{printStyles}</style>
      <div className="no-print">
        <Typography variant="h5" component="h1" sx={{ 
          mb: { xs: 1, sm: 2 }, 
          mt: { xs: 0.5, sm: 1 },
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
        }}>
          Szczegóły Warki
        </Typography>
      </div>
      
      <Grid container spacing={{ xs: 1, sm: 2 }} className="print-content">
        <Grid item xs={12}>
          <WarkaDetails 
            warka={warka}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editFormData={editFormData}
            handleEditChange={handleEditChange}
            handleSaveEdit={handleSaveEdit}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            isMobile={isMobile}
          />
        </Grid>
        
        <Grid item xs={12}>
          <PomiarForm 
            formData={formData}
            dataPomiaru={dataPomiaru}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            isMobile={isMobile}
          />
        </Grid>
        
        <Grid item xs={12}>
          <PrzebiegFermentacji 
            warka={warka}
            przebiegFermentacji={przebiegFermentacji}
            handleDeletePomiar={handleDeletePomiar}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            isMobile={isMobile}
          />
        </Grid>
        
        <Grid item xs={12}>
          <WarkaActions 
            handleArchiveWarka={handleArchiveWarka}
            handleSaveAsRecipe={handleSaveAsRecipe}
            handlePrint={handlePrint}
            isMobile={isMobile}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default SzczegolyWarki;