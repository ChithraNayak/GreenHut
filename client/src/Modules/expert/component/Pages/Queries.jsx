import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";

const DeepGreenButton = styled(Button)({
  color: "#ffffff",
  backgroundColor: "#004d00",
  "&:hover": {
    backgroundColor: "#006400",
  },
});

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [responses, setResponses] = useState({});
  const host = "http://localhost:5000"; // Adjust URL as needed

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get(`${host}/api/queries`);
        if (response.data.success) {
          setQueries(response.data.queries);
        } else {
          console.error("Failed to fetch queries");
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, [host]);

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    setResponseText(query.response || "");
    setOpenModal(true);
  };

  const handleResponseChange = (event) => {
    setResponseText(event.target.value);
  };

  const handleSubmitResponse = async () => {
    if (!selectedQuery) return;

    try {
      const response = await axios.put(
        `${host}/api/queries/${selectedQuery._id}`,
        { response: responseText }
      );
      if (response.data.success) {
        toast.success(response.data.message);

        // Update the local state to reflect the new response
        setQueries((prevQueries) =>
          prevQueries.map((query) =>
            query._id === selectedQuery._id
              ? { ...query, response: responseText }
              : query
          )
        );

        setResponses((prev) => ({
          ...prev,
          [selectedQuery._id]: responseText,
        }));
        setOpenModal(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Error submitting response");
    }
  };

  return (
    <Container>
      <Box>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "black" }}
        >
          Manage Queries
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {queries.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                elevation={1}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.email}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    sx={{ mt: 2 }}
                  >
                    {item.query}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {item.response ? (
                      <Typography variant="body2" color="textPrimary">
                        Response: {item.response}
                      </Typography>
                    ) : (
                      <DeepGreenButton
                        variant="contained"
                        startIcon={<QuestionAnswerIcon />}
                        onClick={() => handleQueryClick(item)}
                      >
                        Respond
                      </DeepGreenButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Respond to Query
          </Typography>
          <TextareaAutosize
            minRows={4}
            placeholder="Type your response here..."
            value={responseText}
            onChange={handleResponseChange}
            style={{ width: "100%", padding: "8px" }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setOpenModal(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <DeepGreenButton onClick={handleSubmitResponse}>
              Submit Response
            </DeepGreenButton>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Queries;
