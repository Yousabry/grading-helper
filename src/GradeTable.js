import React from "react";
import { Table } from "reactstrap";
import { Button } from "reactstrap";

export class GradeTable extends React.Component {
  // STEP 1: Set this array depending on the assignment breakdown
  totals = [2, 2, 2, 2, 2];
  // STEP 2: Put your name and email here
  yourNameAndEmail = "Youssef (youssefsabry@cmail.carleton.ca)";

  maxPossibleScore = this.totals.reduce((a, b) => a + b, 0);

  constructor(props) {
    super(props);
    this.state = {
      qtotals: this.totals.map((item) => item), // mark allocation per question
      qmarks: this.totals.map((item) => item), // marks awarded per question
      comments: this.totals.map((item) => ""), // feedback per question
      prevComments: this.totals.map((item) => []), // saved feedback for each question
      copySuccess: false, // flag for copy functionality
    };
  }

  // Returns the current total score for this student
  getCurrentTotal = () => {
    return this.state.qmarks.reduce((a, b) => a + b, 0);
  };

  markChange = (event, i) => {
    let newMarks = this.state.qmarks;
    newMarks[i] = parseInt(event.target.value);
    this.setState({ qmarks: newMarks });

    this.updateTotal();
  };

  commentChange = (event, i) => {
    let newComments = this.state.comments;
    newComments[i] = event.target.value;
    this.setState({ comments: newComments });
  };

  updateTotal = () => {
    let newTotal = this.state.qmarks.reduce((a, b) => a + b, 0);
    this.setState({ total: newTotal });
  };

  setFeedbackMissing = (i) => {
    // Shortcut to set mark of a question to 0 & feedback to "missing"
    let newMarks = this.state.qmarks;
    let newComments = this.state.comments;

    newMarks[i] = 0;
    newComments[i] = "missing";

    this.setState({
      qmarks: newMarks,
      comments: newComments,
    });
  };

  // Save the mark & feedback of the question at index i
  saveFeedback = (i) => {
    let newFeedback = {
      mark: this.state.qmarks[i],
      comment: this.state.comments[i],
    };

    let newPrevComments = this.state.prevComments;
    newPrevComments[i].push(newFeedback);

    this.setState({
      prevComments: newPrevComments,
    });
  };

  resetScores = () => {
    let newScores = [...this.state.qtotals];
    this.setState({
      qmarks: newScores,
      total: this.maxPossibleScore,
      comments: this.totals.map((item) => ""),
    });
  };

  addFeedback = (feedback, i) => {
    let newComments = this.state.comments;
    newComments[i] = feedback.comment;
    let newMarks = this.state.qmarks;
    newMarks[i] = feedback.mark;
    this.setState({ comments: newComments, qmarks: newMarks });
  };

  deleteSuggestion = (questionIndex, suggestionIndex) => {
    let newSuggestions = this.state.prevComments;
    newSuggestions[questionIndex].splice(suggestionIndex, 1);
    this.setState({ prevComments: newSuggestions });
  };

  copyFeedback = () => {
    var copyText = document.getElementById("feedback");
    copyText.select();
    document.execCommand("copy");
    this.setState({ copySuccess: true });

    setTimeout(() => {
      this.setState({ copySuccess: false });
    }, 2000);
  };

  render() {
    let percentScore = (
      (this.getCurrentTotal() / this.maxPossibleScore) *
      100
    ).toFixed(2);

    // build feedback string
    let feedback = "";
    let delimiter = "\n";
    for (let i = 0; i < this.state.qtotals.length; i++) {
      // Show in final feedback if mark is not perfect or there is a comment
      if (
        this.state.qtotals[i] !== this.state.qmarks[i] ||
        this.state.comments[i]
      ) {
        feedback +=
          `Part ${i + 1} (${this.state.qmarks[i]}/${this.state.qtotals[i]}) - ${
            this.state.comments[i]
          }` + delimiter;
      }
    }

    // if (this.getCurrentTotal() === this.maxPossibleScore) {
    //   // perfect score feedback
    //   feedback = feedback + "good";
    // }

    // End of feedback template
    feedback += `\nTotal Score: ${this.getCurrentTotal()}/${
      this.maxPossibleScore
    }\nMarked by: ${this.yourNameAndEmail}`;

    return (
      <div className="App">
        <div style={{ display: "flex" }}>
          <Table striped bordered hover size="s">
            <thead>
              <tr>
                <th>Question</th>
                <th>Marks allocated</th>
                <th>Total marks</th>
                <th>Comments</th>
                <th>Actions</th>
                <th>Saved Feedback</th>
              </tr>
            </thead>
            <tbody>
              {this.state.qmarks.map((total, i) => {
                return (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>
                      <input
                        style={{ width: "50px" }}
                        type="text"
                        value={this.state.qmarks[i]}
                        onChange={(event) => this.markChange(event, i)}
                      />
                    </td>
                    <td>{this.state.qtotals[i]}</td>
                    <td>
                      <input
                        style={{ width: "400px" }}
                        type="text"
                        value={this.state.comments[i]}
                        onChange={(event) => this.commentChange(event, i)}
                      />
                    </td>
                    <td>
                      <button onClick={() => this.setFeedbackMissing(i)}>
                        missing
                      </button>
                      <button onClick={() => this.saveFeedback(i)}>save</button>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {this.state.prevComments[i].map(
                          (savedFeedback, suggestionIndex) => (
                            <div
                              style={{
                                cursor: "pointer",
                                display: "flex",
                                margin: "0px 10px",
                              }}
                            >
                              <span
                                onClick={() => {
                                  this.addFeedback(savedFeedback, i);
                                }}
                                style={{
                                  marginRight: "10px",
                                  maxWidth: "100px",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                }}
                              >{`(${savedFeedback.mark}) ${savedFeedback.comment}`}</span>
                              <span
                                onClick={() =>
                                  this.deleteSuggestion(i, suggestionIndex)
                                }
                                style={{ color: "red" }}
                              >
                                X
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            margin: "10px",
            alignItems: "center",
          }}
        >
          <Button
            onClick={this.resetScores}
            style={{ margin: "15px", width: "110px", height: "40px" }}
          >
            Reset
          </Button>
          <span>
            Total: {this.getCurrentTotal()}/{this.maxPossibleScore} (
            {percentScore}%)
          </span>
          <Button
            onClick={this.copyFeedback}
            style={{ margin: "15px", width: "110px", height: "40px" }}
          >
            Copy Feedback
          </Button>
          {this.state.copySuccess && <div>&#9989;</div>}
        </div>

        <div style={{ display: "flex", marginLeft: "10px" }}>
          <textarea
            readOnly
            value={feedback}
            style={{ width: "500px", height: "300px" }}
            id="feedback"
          ></textarea>
        </div>
      </div>
    );
  }
}
