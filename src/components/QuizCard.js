import React, { useMemo } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Checkbox, CardActions } from '@mui/material';

function QuizCard({ questionData, selectedAnswers, onOptionChange }) {

  const shuffledOptions = useMemo(() => {
    const shuffled = [...questionData?.options];
    const indices = [...Array(shuffled.length).keys()];
    indices.sort(() => Math.random() - 0.5);

    const shuffledOptions = indices.map((i) => shuffled[i]);
    return { shuffledOptions, indices };
  }, [questionData]);

  const handleOptionChange = (event) => {
    const value = event.target.value;
    const updatedAnswers = selectedAnswers.includes(value)
      ? selectedAnswers.filter((item) => item !== value)
      : [...selectedAnswers, value];

    onOptionChange(updatedAnswers);
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 500, margin: '20px auto', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          {questionData?.question}
        </Typography>
        {shuffledOptions.shuffledOptions.map((option, index) => (
          <FormControlLabel
            key={shuffledOptions.indices[index]}  // Use the original index as key
            control={
              <Checkbox
                value={shuffledOptions.indices[index].toString()}
                checked={selectedAnswers.includes(shuffledOptions.indices[index].toString())}
                onChange={handleOptionChange}
                sx={{ marginRight: 2 }}
              />
            }
            label={option}
            sx={{ marginBottom: 1.5 }}
          />
        ))}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }} />
    </Card>
  );
}

export default QuizCard;
