import { useState } from "react";
import { registerUser, getVault, updateVault } from "./api";
import { encryptVault, decryptVault, generateKey } from "./crypto";

interface VaultData {
  passwords: { site: string; username: string; password: string }[];
}

function App() {
  const [email, setEmail] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [vault, setVault] = useState<VaultData>({ passwords: [] });
  const [loggedIn, setLoggedIn] = useState(false);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const key = await generateKey(masterPassword);
    const encryptedVault = await encryptVault(vault, key);
    await registerUser(email, encryptedVault);
    setLoggedIn(true);
    alert("Registered successfully!");
  };

  const handleLogin = async () => {
    const encryptedVault = await getVault(email);
    const key = await generateKey(masterPassword);
    const decryptedVault = await decryptVault(encryptedVault, key);
    setVault(decryptedVault);
    setLoggedIn(true);
  };

  const handleAddPassword = async () => {
    const newVault = {
      passwords: [...vault.passwords, { site, username, password }],
    };
    setVault(newVault);

    const key = await generateKey(masterPassword);
    const encryptedVault = await encryptVault(newVault, key);
    await updateVault(email, encryptedVault);

    setSite("");
    setUsername("");
    setPassword("");
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>ZCloudPass</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Master Password"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Vault</h1>
      <div>
        <input
          placeholder="Site"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAddPassword}>Add Password</button>
      </div>

      <h2>Saved Passwords</h2>
      {vault.passwords.map((p, i) => (
        <div key={i}>
          <strong>{p.site}</strong>: {p.username} / {p.password}
        </div>
      ))}
    </div>
  );
}

export default App;
