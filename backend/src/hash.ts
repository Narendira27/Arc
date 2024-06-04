const hashPassword = async (password: string) => {
  const myText = new TextEncoder().encode(password);
  const myDigest = await crypto.subtle.digest(
    {
      name: "SHA-256",
    },
    myText
  );
  const hashedPasswordArr = new Uint8Array(myDigest);
  const PasswordHash = new TextDecoder().decode(hashedPasswordArr);
  return PasswordHash;
};

const verifyHash = async (hash: string, password: string) => {
  const encodeUserPassword = new TextEncoder().encode(password);
  const userpassHash = await crypto.subtle.digest(
    {
      name: "SHA-256",
    },
    encodeUserPassword
  );
  const userArr = new Uint8Array(userpassHash);
  const userHash = new TextDecoder().decode(userArr);
  return hash === userHash;
};

export { hashPassword, verifyHash };
