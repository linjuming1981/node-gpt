async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/suno/bark",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
    const result = await response.blob();
    return result;
  }
  query({"inputs": "The answer to the universe is 42"}).then((response) => {
    // Returns a byte object of the Audio wavform. Use it directly!
    console.log(response)
  });