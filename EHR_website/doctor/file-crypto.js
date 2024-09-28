async function getKey(password, salt = "somesalt") {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-CBC', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  async function encryptFile(file, password) {
    const key = await getKey(password);
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const data = new Uint8Array(event.target.result);
        const iv = window.crypto.getRandomValues(new Uint8Array(16));
  
        try {
          const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: iv },
            key,
            data
          );
  
          const blob = new Blob([new Uint8Array(encrypted), iv], { type: "application/octet-stream" });
          resolve(blob);  // Resolve the promise with the encrypted blob
        } catch (error) {
          reject('Encryption failed: ' + error);
        }
      };
  
      reader.onerror = (err) => reject('File reading failed: ' + err);
      reader.readAsArrayBuffer(file);
    });
  }
  
  async function decryptFile(file, password) {
    const key = await getKey(password);
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const data = new Uint8Array(event.target.result);
        const iv = data.slice(-16);
        const encryptedData = data.slice(0, -16);
  
        try {
          const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: iv },
            key,
            encryptedData
          );
  
          const blob = new Blob([new Uint8Array(decrypted)], { type: "application/octet-stream" });
          resolve(blob);  // Resolve the promise with the decrypted blob
        } catch (e) {
          reject('Decryption failed: Incorrect password or corrupted data');
        }
      };
  
      reader.onerror = (err) => reject('File reading failed: ' + err);
      reader.readAsArrayBuffer(file);
    });
  }
  
  function downloadFile(blob, filename) {
    const link = document.createElement('a');  // Create the link dynamically if needed
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);  // Append the link to the DOM
    link.click();  // Trigger the download
    document.body.removeChild(link);  // Remove the link after downloading
  }
  