import React, { useMemo } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Checkbox, Radio, CardActions, Box } from '@mui/material';

function QuizCard({ questionData, selectedAnswers, onOptionChange }) {
  const isCheckbox = questionData.type === 'checkbox';

  const shuffledOptions = useMemo(() => {
    const shuffled = [...questionData?.options];
    const indices = [...Array(shuffled.length).keys()];
    indices.sort(() => Math.random() - 0.5);

    const shuffledOptions = indices.map((i) => shuffled[i]);
    return { shuffledOptions, indices };
  }, [questionData]);

  const handleOptionChange = (event) => {
    const value = event.target.value;

    if (isCheckbox) {
      const updatedAnswers = selectedAnswers.includes(value)
        ? selectedAnswers.filter((item) => item !== value)
        : [...selectedAnswers, value];
      onOptionChange(updatedAnswers);
    } else {
      onOptionChange([value]);
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 500, margin: '20px auto', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          {questionData?.question}
        </Typography>
        {shuffledOptions.shuffledOptions.map((option, index) => (
          <Box key={shuffledOptions.indices[index]} sx={{ display: 'block', width: '100%' }}>
            <FormControlLabel
              control={
                isCheckbox ? (
                  <Checkbox
                    value={shuffledOptions.indices[index].toString()}
                    checked={selectedAnswers.includes(shuffledOptions.indices[index].toString())}
                    onChange={handleOptionChange}
                    sx={{ marginRight: 2 }}
                  />
                ) : (
                  <Radio
                    value={shuffledOptions.indices[index].toString()}
                    checked={selectedAnswers.includes(shuffledOptions.indices[index].toString())}
                    onChange={handleOptionChange}
                    sx={{ marginRight: 2 }}
                  />
                )
              }
              label={option}
              sx={{ marginBottom: 1.5, width: '100%' }}  // Ensures each option spans full width
            />
          </Box>
        ))}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }} />
    </Card>
  );
}

export default QuizCard;
