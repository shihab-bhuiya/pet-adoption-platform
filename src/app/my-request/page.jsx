// Add this route into your async function run() block inside backend index.js:

app.get('/api/my-adoption-requests', async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).send({ message: "Email query parameter is required" });
    }

    const adoptionCollection = client.db("pet-adoption").collection("adoptionRequests");
    
    // Query filter: find items matching the applicant's email address
    const query = { userEmail: userEmail };
    const result = await adoptionCollection.find(query).toArray();
    
    res.status(200).send(result);
  } catch (error) {
    console.error("Error retrieving user adoption requests:", error);
    res.status(500).send({ message: "Server error recovering applications history" });
  }
});