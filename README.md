# Setup
Open `src/config.json` and set the variables

Sample commented JSON:
```
{
  // set the amount of points for each question (ex. q1 = 2 points, q2 = 3 points, q3 = 5 points)
  "assignmentBreakdown": [2,3,5],

  // a signature appended to each feedback string (ex. Graded By: TA Name (email))
  "signature": "TA Name (email)",

  // extra label for each question preceeds the numbering (ex. Question 1 - ...)
  "questionLabel": "Question",

  // provide existing comments here exported from a previous run of the server (if not using set to null or omit entirely)
  "initialComments": null
}
```

# Exporting Comments
If you are not done marking but you want to preserve feedback comments click the export button and it will be copied to clipboard. You can later provide it in `config.json` to resume with the same feedback comments

# To run
`yarn start`

Then go to `localhost:3000`
