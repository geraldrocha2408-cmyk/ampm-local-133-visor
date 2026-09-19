// Reconstructs the original Float32 buffer bit-for-bit from attribute dictionaries.
window.decodeViewerGeometry = function(buffer) {
 const dv=new DataView(buffer);
 if(dv.getUint32(0,true)!==0x31504d41)throw new Error('Formato de geometría no reconocido');
 const count=dv.getUint32(4,true), out=new Uint32Array(count*8);let p=8,col=0;
 for(let a=0;a<3;a++){
  const width=dv.getUint32(p,true), size=dv.getUint32(p+4,true);p+=8;
  const values=new Uint32Array(buffer,p,size*width);p+=size*width*4;
  const indices=new Uint32Array(buffer,p,count);p+=count*4;
  for(let i=0;i<count;i++){const src=indices[i]*width,dst=i*8+col;for(let j=0;j<width;j++)out[dst+j]=values[src+j];}
  col+=width;
 }
 if(p!==buffer.byteLength)throw new Error('Geometría incompleta');
 return out.buffer;
};
