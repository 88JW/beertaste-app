import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography,
  Box,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Fade
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import questions from './quizQuestions';

function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Funkcja do losowania n pytań z tablicy
  const getRandomQuestions = (allQuestions, n) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };
  
  // Inicjalizacja quizu z losowymi pytaniami
  useEffect(() => {
    startNewQuiz();
  }, []);
  
  // Funkcja rozpoczynająca nowy quiz
  const startNewQuiz = () => {
    const randomizedQuestions = getRandomQuestions(questions, 10);
    setQuizQuestions(randomizedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleCheckAnswer = () => {
    // Sprawdź poprawność odpowiedzi
    const correct = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    // Pokaż informację zwrotną
    setShowFeedback(true);
    
    // Dodaj punkt za poprawną odpowiedź
    if (correct) {
      setScore(score + 1);
    }
  };
  
  const handleNextQuestion = () => {
    setShowFeedback(false);
    const nextQuestion = currentQuestion + 1;
    
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer('');
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    startNewQuiz();
  };

  // Sprawdzenie czy pytania zostały już załadowane
  if (quizQuestions.length === 0) {
    return <Container maxWidth="md" sx={{ mt: 4 }}><Typography>Ładowanie pytań...</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Quiz o Piwie
      </Typography>
      
      <Typography variant="subtitle1" align="center" gutterBottom>
        Wylosowano 10 pytań z puli {questions.length} pytań
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {showScore ? (
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              Twój wynik: {score} z {quizQuestions.length}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleRestart}
              sx={{ mt: 2 }}
            >
              Rozpocznij ponownie
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Pytanie {currentQuestion + 1}/{quizQuestions.length}
            </Typography>
            <Typography variant="body1" paragraph>
              {quizQuestions[currentQuestion].question}
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                name="quiz-options"
                value={selectedAnswer}
                onChange={handleAnswerChange}
              >
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel 
                    key={index} 
                    value={option} 
                    control={<Radio />} 
                    label={option} 
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {showFeedback && (
              <Fade in={showFeedback}>
                <Box mt={2}>
                  <Alert severity={isCorrect ? "success" : "error"}>
                    {isCorrect 
                      ? "Poprawna odpowiedź!" 
                      : `Niepoprawna odpowiedź. Prawidłowa odpowiedź to: ${quizQuestions[currentQuestion].correctAnswer}`}
                  </Alert>
                </Box>
              </Fade>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {!showFeedback ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                >
                  Sprawdź odpowiedź
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleNextQuestion}
                >
                  {currentQuestion === quizQuestions.length - 1 ? 'Zakończ quiz' : 'Następne pytanie'}
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIosNewIcon />} 
          onClick={() => navigate("/")}
        >
          Wstecz
        </Button>
      </Box>
    </Container>
  );
}

export default Quiz;
