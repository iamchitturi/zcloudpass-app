const API_URL = "http://localhost:3000";

export async function registerUser(email: string, encryptedVault: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, encrypted_vault: encryptedVault }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function getVault(email: string): Promise<string> {
  const res = await fetch(`${API_URL}/vault/${email}`);
  if (!res.ok) throw new Error("Failed to get vault");
  const data = await res.json();
  return data.encrypted_vault;
}

export async function updateVault(email: string, encryptedVault: string) {
  const res = await fetch(`${API_URL}/vault/${email}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ encrypted_vault: encryptedVault }),
  });
  if (!res.ok) throw new Error("Failed to update vault");
}
