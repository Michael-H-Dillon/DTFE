import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Container, List, ListItem, ListItemText } from '@mui/material';
import { QUIZ_DATA } from '../data/questions';
import QuizCard from '../components/QuizCard';

const ANSWERS_PER_PAGE = 1;

function QuizPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [incorrectPage, setIncorrectPage] = useState(0);

  const questionKeys = Object.keys(QUIZ_DATA);

  const handleOptionChange = (answers, questionKey) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionKey]: answers,
    }));
  };

  const handleNavigation = (direction) => {
    if (direction === 'next' && questionIndex + 1 < questionKeys.length) {
      setQuestionIndex(questionIndex + 1);
    } else if (direction === 'prev' && questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsQuizFinished(true);
    checkIncorrectAnswers();
  };

  const handleRestart = () => {
    setIsQuizFinished(false);
    setUserAnswers({});
    setQuestionIndex(0);
    setIncorrectQuestions([]);
    setIncorrectPage(0);
  };

  const checkIncorrectAnswers = () => {
    const incorrects = questionKeys.filter((questionKey) => {
      const correctOptions = QUIZ_DATA[questionKey]?.correct_options || [];
      const userAnswer = userAnswers[questionKey] || [];
      return !userAnswer.length || !userAnswer.every((value) => correctOptions.includes(Number(value)));
    });

    setIncorrectQuestions(incorrects);
  };

  const calculateScore = () => {
    return Object.entries(userAnswers).reduce((score, [questionKey, answers]) => {
      const correctOptions = QUIZ_DATA[questionKey]?.correct_options || [];
      const isCorrect = answers.every((value) => correctOptions.includes(Number(value)));
      return score + (isCorrect ? 1 : 0);
    }, 0);
  };

  const paginatedIncorrectAnswers = incorrectQuestions.slice(
    incorrectPage * ANSWERS_PER_PAGE,
    (incorrectPage + 1) * ANSWERS_PER_PAGE
  );

  const handleIncorrectPageChange = (direction) => {
    if (direction === 'next' && (incorrectPage + 1) * ANSWERS_PER_PAGE < incorrectQuestions.length) {
      setIncorrectPage(incorrectPage + 1);
    } else if (direction === 'prev' && incorrectPage > 0) {
      setIncorrectPage(incorrectPage - 1);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant='h4' color='primary' sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: {sm: '1rem', md: '2rem'}}}>
        Question {questionIndex + 1} / {questionKeys.length}
      </Typography>
      <Paper sx={{ padding: 4, boxShadow: 3, marginTop: 5 }}>
        {isQuizFinished ? (
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom color="primary">
              Quiz Finished!
            </Typography>

            <Typography variant="h6" mt={3} color="textSecondary">
              Your score: {calculateScore()} / {questionKeys.length}
            </Typography>

            <hr style={{ margin: '30px 0', border: '1px solid #ccc' }} /> {/* Horizontal Rule */}

            {incorrectQuestions.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Incorrect Answers:
                </Typography>
                {paginatedIncorrectAnswers.map((questionKey) => {
                  const questionData = QUIZ_DATA[questionKey];
                  const correctAnswers = questionData?.correct_options.map((index) => questionData?.options[index]);
                  const userAnswersStrings = userAnswers[questionKey]?.map((index) => questionData?.options[index]);

                  return (
                    <Box key={questionKey} mt={3}>
                      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                        {questionData?.question}
                      </Typography>

                      <hr style={{ margin: '20px 0', border: '1px solid #ddd' }} /> {/* Horizontal Rule */}

                      {/* Correct Answer */}
                      <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                        Correct Answer:
                      </Typography>
                      <List>
                        {correctAnswers.map((answer, index) => (
                          <ListItem key={`correct-${index}`}>
                            <ListItemText primary={answer} sx={{ fontSize: '0.875rem' }} />
                          </ListItem>
                        ))}
                      </List>

                      <hr style={{ margin: '20px 0', border: '1px solid #ddd' }} />

                      {/* Your Answer */}
                      <Typography variant="subtitle1" color="error" sx={{ fontWeight: 'bold' }}>
                        Your Answer:
                      </Typography>
                      <List>
                        {(userAnswersStrings || ['No answer']).map((answer, index) => (
                          <ListItem key={`user-${index}`}>
                            <ListItemText primary={answer} sx={{ fontSize: '0.875rem' }} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  );
                })}

                <Box display="flex" justifyContent="center" mt={3}>
                  <Button
                    variant="outlined"
                    onClick={() => handleIncorrectPageChange('prev')}
                    disabled={incorrectPage === 0}
                    sx={{ marginRight: 2 }}
                  >
                    Previous Page
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleIncorrectPageChange('next')}
                    disabled={(incorrectPage + 1) * ANSWERS_PER_PAGE >= incorrectQuestions.length}
                  >
                    Next Page
                  </Button>
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 3 }}
              onClick={handleRestart}
            >
              Restart Quiz
            </Button>
          </Box>
        ) : (
          <Box>
            <QuizCard
              questionData={QUIZ_DATA[questionKeys[questionIndex]]}
              onOptionChange={(answers) => handleOptionChange(answers, questionKeys[questionIndex])}
              selectedAnswers={userAnswers[questionKeys[questionIndex]] || []}
            />
            <Box display="flex" justifyContent="space-between" marginTop={3}>
              <Button
                variant="outlined"
                onClick={() => handleNavigation('prev')}
                disabled={questionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={() => (questionIndex === questionKeys.length - 1 ? handleSubmit() : handleNavigation('next'))}
              >
                {questionIndex === questionKeys.length - 1 ? 'Submit Quiz' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default QuizPage;
