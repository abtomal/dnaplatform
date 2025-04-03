var y={},E={},P;function D(){if(P)return E;P=1,Object.defineProperty(E,"__esModule",{value:!0}),E.anumber=s,E.abytes=w,E.ahash=S,E.aexists=O,E.aoutput=A;function s(l){if(!Number.isSafeInteger(l)||l<0)throw new Error("positive integer expected, got "+l)}function g(l){return l instanceof Uint8Array||ArrayBuffer.isView(l)&&l.constructor.name==="Uint8Array"}function w(l,...b){if(!g(l))throw new Error("Uint8Array expected");if(b.length>0&&!b.includes(l.length))throw new Error("Uint8Array expected of length "+b+", got length="+l.length)}function S(l){if(typeof l!="function"||typeof l.create!="function")throw new Error("Hash should be wrapped by utils.wrapConstructor");s(l.outputLen),s(l.blockLen)}function O(l,b=!0){if(l.destroyed)throw new Error("Hash instance has been destroyed");if(b&&l.finished)throw new Error("Hash#digest() has already been called")}function A(l,b){w(l);const m=b.outputLen;if(l.length<m)throw new Error("digestInto() expects output buffer of length at least "+m)}return E}var i={},V;function z(){if(V)return i;V=1,Object.defineProperty(i,"__esModule",{value:!0}),i.add5L=i.add5H=i.add4H=i.add4L=i.add3H=i.add3L=i.rotlBL=i.rotlBH=i.rotlSL=i.rotlSH=i.rotr32L=i.rotr32H=i.rotrBL=i.rotrBH=i.rotrSL=i.rotrSH=i.shrSL=i.shrSH=i.toBig=void 0,i.fromBig=w,i.split=S,i.add=B;const s=BigInt(2**32-1),g=BigInt(32);function w(n,e=!1){return e?{h:Number(n&s),l:Number(n>>g&s)}:{h:Number(n>>g&s)|0,l:Number(n&s)|0}}function S(n,e=!1){let t=new Uint32Array(n.length),r=new Uint32Array(n.length);for(let u=0;u<n.length;u++){const{h:f,l:p}=w(n[u],e);[t[u],r[u]]=[f,p]}return[t,r]}const O=(n,e)=>BigInt(n>>>0)<<g|BigInt(e>>>0);i.toBig=O;const A=(n,e,t)=>n>>>t;i.shrSH=A;const l=(n,e,t)=>n<<32-t|e>>>t;i.shrSL=l;const b=(n,e,t)=>n>>>t|e<<32-t;i.rotrSH=b;const m=(n,e,t)=>n<<32-t|e>>>t;i.rotrSL=m;const x=(n,e,t)=>n<<64-t|e>>>t-32;i.rotrBH=x;const j=(n,e,t)=>n>>>t-32|e<<64-t;i.rotrBL=j;const q=(n,e)=>e;i.rotr32H=q;const C=(n,e)=>n;i.rotr32L=C;const L=(n,e,t)=>n<<t|e>>>32-t;i.rotlSH=L;const I=(n,e,t)=>e<<t|n>>>32-t;i.rotlSL=I;const T=(n,e,t)=>e<<t-32|n>>>64-t;i.rotlBH=T;const U=(n,e,t)=>n<<t-32|e>>>64-t;i.rotlBL=U;function B(n,e,t,r){const u=(e>>>0)+(r>>>0);return{h:n+t+(u/2**32|0)|0,l:u|0}}const k=(n,e,t)=>(n>>>0)+(e>>>0)+(t>>>0);i.add3L=k;const H=(n,e,t,r)=>e+t+r+(n/2**32|0)|0;i.add3H=H;const a=(n,e,t,r)=>(n>>>0)+(e>>>0)+(t>>>0)+(r>>>0);i.add4L=a;const o=(n,e,t,r,u)=>e+t+r+u+(n/2**32|0)|0;i.add4H=o;const c=(n,e,t,r,u)=>(n>>>0)+(e>>>0)+(t>>>0)+(r>>>0)+(u>>>0);i.add5L=c;const h=(n,e,t,r,u,f)=>e+t+r+u+f+(n/2**32|0)|0;i.add5H=h;const d={fromBig:w,split:S,toBig:O,shrSH:A,shrSL:l,rotrSH:b,rotrSL:m,rotrBH:x,rotrBL:j,rotr32H:q,rotr32L:C,rotlSH:L,rotlSL:I,rotlBH:T,rotlBL:U,add:B,add3L:k,add3H:H,add4L:a,add4H:o,add5H:h,add5L:c};return i.default=d,i}var R={},F={},X;function G(){return X||(X=1,Object.defineProperty(F,"__esModule",{value:!0}),F.crypto=void 0,F.crypto=typeof globalThis=="object"&&"crypto"in globalThis?globalThis.crypto:void 0),F}var N;function J(){return N||(N=1,function(s){/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */Object.defineProperty(s,"__esModule",{value:!0}),s.Hash=s.nextTick=s.byteSwapIfBE=s.isLE=void 0,s.isBytes=S,s.u8=O,s.u32=A,s.createView=l,s.rotr=b,s.rotl=m,s.byteSwap=x,s.byteSwap32=j,s.bytesToHex=C,s.hexToBytes=T,s.asyncLoop=B,s.utf8ToBytes=k,s.toBytes=H,s.concatBytes=a,s.checkOpts=c,s.wrapConstructor=h,s.wrapConstructorWithOpts=d,s.wrapXOFConstructorWithOpts=n,s.randomBytes=e;const g=G(),w=D();function S(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function O(t){return new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}function A(t){return new Uint32Array(t.buffer,t.byteOffset,Math.floor(t.byteLength/4))}function l(t){return new DataView(t.buffer,t.byteOffset,t.byteLength)}function b(t,r){return t<<32-r|t>>>r}function m(t,r){return t<<r|t>>>32-r>>>0}s.isLE=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function x(t){return t<<24&4278190080|t<<8&16711680|t>>>8&65280|t>>>24&255}s.byteSwapIfBE=s.isLE?t=>t:t=>x(t);function j(t){for(let r=0;r<t.length;r++)t[r]=x(t[r])}const q=Array.from({length:256},(t,r)=>r.toString(16).padStart(2,"0"));function C(t){(0,w.abytes)(t);let r="";for(let u=0;u<t.length;u++)r+=q[t[u]];return r}const L={_0:48,_9:57,A:65,F:70,a:97,f:102};function I(t){if(t>=L._0&&t<=L._9)return t-L._0;if(t>=L.A&&t<=L.F)return t-(L.A-10);if(t>=L.a&&t<=L.f)return t-(L.a-10)}function T(t){if(typeof t!="string")throw new Error("hex string expected, got "+typeof t);const r=t.length,u=r/2;if(r%2)throw new Error("hex string expected, got unpadded hex of length "+r);const f=new Uint8Array(u);for(let p=0,_=0;p<u;p++,_+=2){const v=I(t.charCodeAt(_)),M=I(t.charCodeAt(_+1));if(v===void 0||M===void 0){const K=t[_]+t[_+1];throw new Error('hex string expected, got non-hex character "'+K+'" at index '+_)}f[p]=v*16+M}return f}const U=async()=>{};s.nextTick=U;async function B(t,r,u){let f=Date.now();for(let p=0;p<t;p++){u(p);const _=Date.now()-f;_>=0&&_<r||(await(0,s.nextTick)(),f+=_)}}function k(t){if(typeof t!="string")throw new Error("utf8ToBytes expected string, got "+typeof t);return new Uint8Array(new TextEncoder().encode(t))}function H(t){return typeof t=="string"&&(t=k(t)),(0,w.abytes)(t),t}function a(...t){let r=0;for(let f=0;f<t.length;f++){const p=t[f];(0,w.abytes)(p),r+=p.length}const u=new Uint8Array(r);for(let f=0,p=0;f<t.length;f++){const _=t[f];u.set(_,p),p+=_.length}return u}class o{clone(){return this._cloneInto()}}s.Hash=o;function c(t,r){if(r!==void 0&&{}.toString.call(r)!=="[object Object]")throw new Error("Options should be object or undefined");return Object.assign(t,r)}function h(t){const r=f=>t().update(H(f)).digest(),u=t();return r.outputLen=u.outputLen,r.blockLen=u.blockLen,r.create=()=>t(),r}function d(t){const r=(f,p)=>t(p).update(H(f)).digest(),u=t({});return r.outputLen=u.outputLen,r.blockLen=u.blockLen,r.create=f=>t(f),r}function n(t){const r=(f,p)=>t(p).update(H(f)).digest(),u=t({});return r.outputLen=u.outputLen,r.blockLen=u.blockLen,r.create=f=>t(f),r}function e(t=32){if(g.crypto&&typeof g.crypto.getRandomValues=="function")return g.crypto.getRandomValues(new Uint8Array(t));if(g.crypto&&typeof g.crypto.randomBytes=="function")return g.crypto.randomBytes(t);throw new Error("crypto.getRandomValues must be defined")}}(R)),R}var W;function Q(){if(W)return y;W=1,Object.defineProperty(y,"__esModule",{value:!0}),y.shake256=y.shake128=y.keccak_512=y.keccak_384=y.keccak_256=y.keccak_224=y.sha3_512=y.sha3_384=y.sha3_256=y.sha3_224=y.Keccak=void 0,y.keccakP=U;const s=D(),g=z(),w=J(),S=[],O=[],A=[],l=BigInt(0),b=BigInt(1),m=BigInt(2),x=BigInt(7),j=BigInt(256),q=BigInt(113);for(let a=0,o=b,c=1,h=0;a<24;a++){[c,h]=[h,(2*c+3*h)%5],S.push(2*(5*h+c)),O.push((a+1)*(a+2)/2%64);let d=l;for(let n=0;n<7;n++)o=(o<<b^(o>>x)*q)%j,o&m&&(d^=b<<(b<<BigInt(n))-b);A.push(d)}const[C,L]=(0,g.split)(A,!0),I=(a,o,c)=>c>32?(0,g.rotlBH)(a,o,c):(0,g.rotlSH)(a,o,c),T=(a,o,c)=>c>32?(0,g.rotlBL)(a,o,c):(0,g.rotlSL)(a,o,c);function U(a,o=24){const c=new Uint32Array(10);for(let h=24-o;h<24;h++){for(let e=0;e<10;e++)c[e]=a[e]^a[e+10]^a[e+20]^a[e+30]^a[e+40];for(let e=0;e<10;e+=2){const t=(e+8)%10,r=(e+2)%10,u=c[r],f=c[r+1],p=I(u,f,1)^c[t],_=T(u,f,1)^c[t+1];for(let v=0;v<50;v+=10)a[e+v]^=p,a[e+v+1]^=_}let d=a[2],n=a[3];for(let e=0;e<24;e++){const t=O[e],r=I(d,n,t),u=T(d,n,t),f=S[e];d=a[f],n=a[f+1],a[f]=r,a[f+1]=u}for(let e=0;e<50;e+=10){for(let t=0;t<10;t++)c[t]=a[e+t];for(let t=0;t<10;t++)a[e+t]^=~c[(t+2)%10]&c[(t+4)%10]}a[0]^=C[h],a[1]^=L[h]}c.fill(0)}class B extends w.Hash{constructor(o,c,h,d=!1,n=24){if(super(),this.blockLen=o,this.suffix=c,this.outputLen=h,this.enableXOF=d,this.rounds=n,this.pos=0,this.posOut=0,this.finished=!1,this.destroyed=!1,(0,s.anumber)(h),0>=this.blockLen||this.blockLen>=200)throw new Error("Sha3 supports only keccak-f1600 function");this.state=new Uint8Array(200),this.state32=(0,w.u32)(this.state)}keccak(){w.isLE||(0,w.byteSwap32)(this.state32),U(this.state32,this.rounds),w.isLE||(0,w.byteSwap32)(this.state32),this.posOut=0,this.pos=0}update(o){(0,s.aexists)(this);const{blockLen:c,state:h}=this;o=(0,w.toBytes)(o);const d=o.length;for(let n=0;n<d;){const e=Math.min(c-this.pos,d-n);for(let t=0;t<e;t++)h[this.pos++]^=o[n++];this.pos===c&&this.keccak()}return this}finish(){if(this.finished)return;this.finished=!0;const{state:o,suffix:c,pos:h,blockLen:d}=this;o[h]^=c,(c&128)!==0&&h===d-1&&this.keccak(),o[d-1]^=128,this.keccak()}writeInto(o){(0,s.aexists)(this,!1),(0,s.abytes)(o),this.finish();const c=this.state,{blockLen:h}=this;for(let d=0,n=o.length;d<n;){this.posOut>=h&&this.keccak();const e=Math.min(h-this.posOut,n-d);o.set(c.subarray(this.posOut,this.posOut+e),d),this.posOut+=e,d+=e}return o}xofInto(o){if(!this.enableXOF)throw new Error("XOF is not possible for this instance");return this.writeInto(o)}xof(o){return(0,s.anumber)(o),this.xofInto(new Uint8Array(o))}digestInto(o){if((0,s.aoutput)(o,this),this.finished)throw new Error("digest() was already called");return this.writeInto(o),this.destroy(),o}digest(){return this.digestInto(new Uint8Array(this.outputLen))}destroy(){this.destroyed=!0,this.state.fill(0)}_cloneInto(o){const{blockLen:c,suffix:h,outputLen:d,rounds:n,enableXOF:e}=this;return o||(o=new B(c,h,d,e,n)),o.state32.set(this.state32),o.pos=this.pos,o.posOut=this.posOut,o.finished=this.finished,o.rounds=n,o.suffix=h,o.outputLen=d,o.enableXOF=e,o.destroyed=this.destroyed,o}}y.Keccak=B;const k=(a,o,c)=>(0,w.wrapConstructor)(()=>new B(o,a,c));y.sha3_224=k(6,144,224/8),y.sha3_256=k(6,136,256/8),y.sha3_384=k(6,104,384/8),y.sha3_512=k(6,72,512/8),y.keccak_224=k(1,144,224/8),y.keccak_256=k(1,136,256/8),y.keccak_384=k(1,104,384/8),y.keccak_512=k(1,72,512/8);const H=(a,o,c)=>(0,w.wrapXOFConstructorWithOpts)((h={})=>new B(o,a,h.dkLen===void 0?c:h.dkLen,!0));return y.shake128=H(31,168,128/8),y.shake256=H(31,136,256/8),y}export{J as a,D as b,Q as r};
