async function check() {
  try {
    const res = await fetch("http://localhost:3000/api/re-trac", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawData: "test aml structuring" })
    });
    const text = await res.text();
    console.log("RESPONSE_STATUS:", res.status);
    console.log("RESPONSE_BODY:", text);
  } catch (err) {
    console.error(err);
  }
}
check();
