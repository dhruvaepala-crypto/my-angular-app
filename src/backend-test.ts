export async function testBackend(): Promise<void> {
  try {
    const response = await fetch("http://localhost:3000/api/test");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Backend response:", data);
  } catch (error) {
    console.error("Backend connection failed:", error);
  }
}