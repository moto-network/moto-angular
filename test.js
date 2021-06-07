'use strict'
function rnd256() {
  const bytes = new Uint8Array(32);
  
  // load cryptographically random bytes into array
  window.crypto.getRandomValues(bytes);
  
  // convert byte array to hexademical representation
  const bytesHex = bytes.reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');
  
  // convert hexademical value to a decimal string
  return bytesHex;//BigInt('0x' + bytesHex).toString(16);
}

function render(){
    let h2 = document.getElementById('nft-id');
  var t = document.createTextNode(rnd256()); // Create a text node
  h2.appendChild(t);
}
console.log(rnd256());
