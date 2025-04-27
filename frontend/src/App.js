// // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // import "./App.css";

// // // // // // // function App() {
// // // // // // //   // Splash state
// // // // // // //   const [showSplash, setShowSplash]       = useState(true);
// // // // // // //   const [showLetters, setShowLetters]     = useState(false);
// // // // // // //   const [spreadLetters, setSpreadLetters] = useState(false);
// // // // // // //   const [fadeSplash, setFadeSplash]       = useState(false);

// // // // // // //   // Main app state (unchanged)
// // // // // // //   const [activeStep, setActiveStep]       = useState(0);
// // // // // // //   const [selectedImage, setSelectedImage] = useState(null);
// // // // // // //   const [isProcessing, setIsProcessing]   = useState(false);
// // // // // // //   const [progress, setProgress]           = useState(0);

// // // // // // //   // Splash / letter animation timers
// // // // // // //   useEffect(() => {
// // // // // // //     const dropTimer   = setTimeout(() => setShowLetters(true), 300);
// // // // // // //     const spreadTimer = setTimeout(() => setSpreadLetters(true), 2200);
// // // // // // //     const fadeTimer   = setTimeout(() => setFadeSplash(true), 3000);
// // // // // // //     const hideTimer   = setTimeout(() => setShowSplash(false), 3500);
// // // // // // //     return () => {
// // // // // // //       clearTimeout(dropTimer);
// // // // // // //       clearTimeout(spreadTimer);
// // // // // // //       clearTimeout(fadeTimer);
// // // // // // //       clearTimeout(hideTimer);
// // // // // // //     };
// // // // // // //   }, []);

// // // // // // //   // Print progress bar logic
// // // // // // //   useEffect(() => {
// // // // // // //     let iv;
// // // // // // //     if (activeStep === 3) {
// // // // // // //       iv = setInterval(() => {
// // // // // // //         setProgress(p => (p >= 100 ? (clearInterval(iv), 100) : p + 5));
// // // // // // //       }, 300);
// // // // // // //     }
// // // // // // //     return () => clearInterval(iv);
// // // // // // //   }, [activeStep]);

// // // // // // //   // Helper to simulate work
// // // // // // //   const simulate = (cb, ms = 1500) => setTimeout(cb, ms);

// // // // // // //   const handleImageCapture = () => {
// // // // // // //     setIsProcessing(true);
// // // // // // //     simulate(() => {
// // // // // // //       setSelectedImage("/api/placeholder/400/300");
// // // // // // //       setIsProcessing(false);
// // // // // // //       setActiveStep(1);
// // // // // // //     });
// // // // // // //   };
// // // // // // //   const handleImageUpload = () => {
// // // // // // //     setIsProcessing(true);
// // // // // // //     simulate(() => {
// // // // // // //       setSelectedImage("/api/placeholder/400/300");
// // // // // // //       setIsProcessing(false);
// // // // // // //       setActiveStep(1);
// // // // // // //     });
// // // // // // //   };
// // // // // // //   const generatePatch = () => {
// // // // // // //     setIsProcessing(true);
// // // // // // //     simulate(() => {
// // // // // // //       setIsProcessing(false);
// // // // // // //       setActiveStep(2);
// // // // // // //     }, 2000);
// // // // // // //   };
// // // // // // //   const printPatch = () => {
// // // // // // //     setProgress(0);
// // // // // // //     setActiveStep(3);
// // // // // // //   };

// // // // // // //   // Render splash
// // // // // // //   if (showSplash) {
// // // // // // //     const title = "SNAPPATCH";
// // // // // // //     const len = title.length;
// // // // // // //     const spacing = 60; // px between letters after spread
// // // // // // //     return (
// // // // // // //       <div className={`splash ${fadeSplash ? "fade-out" : ""}`}>
// // // // // // //         <div className="splash-grid" />
// // // // // // //         <div className="splash-text">
// // // // // // //           {title.split("").map((ch, i) => {
// // // // // // //             // center index = (len-1)/2
// // // // // // //             const center = (len - 1) / 2;
// // // // // // //             const dx = (i - center) * spacing;
// // // // // // //             const style = {
// // // // // // //               opacity: showLetters ? 1 : 0,
// // // // // // //               transform: showLetters
// // // // // // //                 ? spreadLetters
// // // // // // //                   ? `translateX(${dx}px) translateY(0)`
// // // // // // //                   : "translateY(0)"
// // // // // // //                 : "translateY(-200px)",
// // // // // // //               transition: spreadLetters
// // // // // // //                 ? "transform 0.8s ease-in-out, opacity 0.8s ease-in-out"
// // // // // // //                 : `transform 0.6s ease-out ${0.1 * i}s, opacity 0.6s ease-out ${0.1 * i}s`
// // // // // // //             };
// // // // // // //             return (
// // // // // // //               <span key={i} className="letter" style={style}>
// // // // // // //                 {ch}
// // // // // // //               </span>
// // // // // // //             );
// // // // // // //           })}
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   // Render main UI
// // // // // // //   return (
// // // // // // //     <div className="app-container">
// // // // // // //       {/* Header */}
// // // // // // //       <header className="app-header">
// // // // // // //         <div className="container">
// // // // // // //           <h1>SnapPatch Tracks</h1>
// // // // // // //           <p>AI-Powered Custom Wound Dressings</p>
// // // // // // //         </div>
// // // // // // //       </header>

// // // // // // //       {/* Steps */}
// // // // // // //       <div className="steps container">
// // // // // // //         {["Capture", "Process", "Preview", "Print"].map((step, idx) => (
// // // // // // //           <div key={idx} className="step">
// // // // // // //             <div className={`circle ${activeStep >= idx ? "active" : ""}`}>{idx + 1}</div>
// // // // // // //             <div className={`label ${activeStep >= idx ? "active" : ""}`}>{step}</div>
// // // // // // //           </div>
// // // // // // //         ))}
// // // // // // //         <div className="progress-line">
// // // // // // //           <div className="progress-bar" style={{ width: `${(activeStep / 3) * 100}%` }} />
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Capture Card */}
// // // // // // //       <main className="app-main container">
// // // // // // //         <div className="card capture-card">
// // // // // // //           <h2>Capture Your Wound</h2>
// // // // // // //           <p>Take a photo or upload an existing image to create your custom patch</p>
// // // // // // //           <div className="upload-area">
// // // // // // //             <i className="bi bi-camera"></i>
// // // // // // //             <p>Capture or upload your wound image here</p>
// // // // // // //             <p className="small">Images are secured and encrypted</p>
// // // // // // //           </div>
// // // // // // //           <div className="btn-row">
// // // // // // //             <button onClick={handleImageCapture} className="btn-modern">
// // // // // // //               <i className="bi bi-camera"></i> Take a Photo
// // // // // // //             </button>
// // // // // // //             <button onClick={handleImageUpload} className="btn-modern btn-light">
// // // // // // //               <i className="bi bi-upload"></i> Upload Image
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Features */}
// // // // // // //         <div className="features row">
// // // // // // //           {[
// // // // // // //             {
// // // // // // //               icon: "bi-camera",
// // // // // // //               title: "Instant Scanning",
// // // // // // //               desc:
// // // // // // //                 "On-device AI processes wound images and creates precise measurements instantly"
// // // // // // //             },
// // // // // // //             {
// // // // // // //               icon: "bi-eye",
// // // // // // //               title: "AR Preview",
// // // // // // //               desc: "See how your custom patch will fit before printing with our AR tool"
// // // // // // //             },
// // // // // // //             {
// // // // // // //               icon: "bi-printer",
// // // // // // //               title: "Quick Printing",
// // // // // // //               desc: "Print your custom patch in minutes with any 3D printer"
// // // // // // //             }
// // // // // // //           ].map((f, i) => (
// // // // // // //             <div key={i} className="feature-card">
// // // // // // //               <i className={`bi ${f.icon}`}></i>
// // // // // // //               <h3>{f.title}</h3>
// // // // // // //               <p>{f.desc}</p>
// // // // // // //             </div>
// // // // // // //           ))}
// // // // // // //         </div>
// // // // // // //       </main>

// // // // // // //       {/* Footer */}
// // // // // // //       <footer className="app-footer">
// // // // // // //         <p>© 2025 SnapPatch Tracks. All rights reserved.</p>
// // // // // // //         <div className="footer-links">
// // // // // // //           <a href="#">Privacy Policy</a>
// // // // // // //           <a href="#">Terms of Service</a>
// // // // // // //           <a href="#">Contact Us</a>
// // // // // // //         </div>
// // // // // // //       </footer>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // // export default App;



// // // // // // import React, { useState, useEffect } from "react";
// // // // // // import "./App.css";

// // // // // // function App() {
// // // // // //   // ─── SPLASH STATES ───
// // // // // //   const [showSplash, setShowSplash]         = useState(true);
// // // // // //   const [showLetters, setShowLetters]       = useState(false);
// // // // // //   const [spreadLetters, setSpreadLetters]   = useState(false);
// // // // // //   const [fadeSplash, setFadeSplash]         = useState(false);

// // // // // //   // ─── MAIN APP STATES ───
// // // // // //   const [activeStep, setActiveStep]         = useState(0);
// // // // // //   const [selectedImage, setSelectedImage]   = useState(null);
// // // // // //   const [isProcessing, setIsProcessing]     = useState(false);
// // // // // //   const [progress, setProgress]             = useState(0);

// // // // // //   // ─── SPLASH TIMING ───
// // // // // //   useEffect(() => {
// // // // // //     const drop   = setTimeout(() => setShowLetters(true), 300);
// // // // // //     const spread = setTimeout(() => setSpreadLetters(true), 2200);
// // // // // //     const fade   = setTimeout(() => setFadeSplash(true), 3000);
// // // // // //     const hide   = setTimeout(() => setShowSplash(false), 3500);
// // // // // //     return () => {
// // // // // //       clearTimeout(drop);
// // // // // //       clearTimeout(spread);
// // // // // //       clearTimeout(fade);
// // // // // //       clearTimeout(hide);
// // // // // //     };
// // // // // //   }, []);

// // // // // //   // ─── PRINT PROGRESS ───
// // // // // //   useEffect(() => {
// // // // // //     let iv;
// // // // // //     if (activeStep === 3) {
// // // // // //       iv = setInterval(() => {
// // // // // //         setProgress(p => (p >= 100 ? (clearInterval(iv), 100) : p + 5));
// // // // // //       }, 300);
// // // // // //     }
// // // // // //     return () => clearInterval(iv);
// // // // // //   }, [activeStep]);

// // // // // //   // ─── HELPERS ───
// // // // // //   const simulate = (cb, ms = 1500) => setTimeout(cb, ms);
// // // // // //   const handleImageCapture = () => {
// // // // // //     setIsProcessing(true);
// // // // // //     simulate(() => {
// // // // // //       setSelectedImage("/api/placeholder/400/300");
// // // // // //       setIsProcessing(false);
// // // // // //       setActiveStep(1);
// // // // // //     });
// // // // // //   };
// // // // // //   const handleImageUpload = () => {
// // // // // //     setIsProcessing(true);
// // // // // //     simulate(() => {
// // // // // //       setSelectedImage("/api/placeholder/400/300");
// // // // // //       setIsProcessing(false);
// // // // // //       setActiveStep(1);
// // // // // //     });
// // // // // //   };
// // // // // //   const generatePatch = () => {
// // // // // //     setIsProcessing(true);
// // // // // //     simulate(() => {
// // // // // //       setIsProcessing(false);
// // // // // //       setActiveStep(2);
// // // // // //     }, 2000);
// // // // // //   };
// // // // // //   const printPatch = () => {
// // // // // //     setProgress(0);
// // // // // //     setActiveStep(3);
// // // // // //   };

// // // // // //   // ─── RENDER SPLASH ───
// // // // // //   if (showSplash) {
// // // // // //     const title = "SNAPPATCH";
// // // // // //     const n     = title.length;
// // // // // //     const spacing = 60;  // px between letters
// // // // // //     return (
// // // // // //       <div className={`splash ${fadeSplash ? "fade-out" : ""}`}>
// // // // // //         <div className="splash-grid" />
// // // // // //         <div className="splash-text">
// // // // // //           {title.split("").map((ch, i) => {
// // // // // //             const center = (n - 1) / 2;
// // // // // //             const dx     = (i - center) * spacing;
// // // // // //             const style = {
// // // // // //               opacity: showLetters ? 1 : 0,
// // // // // //               transform: showLetters
// // // // // //                 ? spreadLetters
// // // // // //                   ? `translateX(${dx}px)`
// // // // // //                   : "translateY(0)"
// // // // // //                 : "translateY(-200px)",
// // // // // //               transition: showLetters
// // // // // //                 ? spreadLetters
// // // // // //                   ? "transform 0.8s ease-out, opacity 0.8s ease-out"
// // // // // //                   : `transform 0.6s ease-out ${0.1 * i}s, opacity 0.6s ease-out ${0.1 * i}s`
// // // // // //                 : undefined
// // // // // //             };
// // // // // //             return (
// // // // // //               <span key={i} className="letter" style={style}>
// // // // // //                 {ch}
// // // // // //               </span>
// // // // // //             );
// // // // // //           })}
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   // ─── RENDER MAIN UI ───
// // // // // //   return (
// // // // // //     <div className="app-container">
// // // // // //       {/* HEADER */}
// // // // // //       <header className="app-header">
// // // // // //         <div className="header-inner">
// // // // // //           <h1>SnapPatch Tracks</h1>
// // // // // //           <p>AI-Powered Custom Wound Dressings</p>
// // // // // //         </div>
// // // // // //       </header>

// // // // // //       {/* STEPS */}
// // // // // //       <div className="steps container">
// // // // // //         {["Capture","Process","Preview","Print"].map((step,idx) => (
// // // // // //           <div key={idx} className="step">
// // // // // //             <div className={`circle ${activeStep>=idx?"active":""}`}>{idx+1}</div>
// // // // // //             <div className={`label  ${activeStep>=idx?"active":""}`}>{step}</div>
// // // // // //           </div>
// // // // // //         ))}
// // // // // //         <div className="progress-line">
// // // // // //           <div className="progress-bar" style={{width:`${(activeStep/3)*100}%`}} />
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* CAPTURE CARD */}
// // // // // //       <main className="app-main container">
// // // // // //         <div className="capture-card">
// // // // // //           <h2>Capture Your Wound</h2>
// // // // // //           <p>Take a photo or upload an existing image to create your custom patch</p>
// // // // // //           <div className="upload-area">
// // // // // //             <i className="bi bi-camera"></i>
// // // // // //             <p>Capture or upload your wound image here</p>
// // // // // //             <p className="small">Images are secured and encrypted</p>
// // // // // //           </div>
// // // // // //           <div className="btn-row">
// // // // // //             <button onClick={handleImageCapture} className="btn-modern">
// // // // // //               <i className="bi bi-camera"></i> Take a Photo
// // // // // //             </button>
// // // // // //             <button onClick={handleImageUpload} className="btn-modern btn-light">
// // // // // //               <i className="bi bi-upload"></i> Upload Image
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* FEATURES */}
// // // // // //         <div className="features row">
// // // // // //           {[
// // // // // //             { icon:"bi-camera", title:"Instant Scanning",  desc:"On-device AI processes wound images and creates precise measurements instantly" },
// // // // // //             { icon:"bi-eye",    title:"AR Preview",       desc:"See how your custom patch will fit before printing with our AR tool"        },
// // // // // //             { icon:"bi-printer",title:"Quick Printing",   desc:"Print your custom patch in minutes with any 3D printer"                  }
// // // // // //           ].map((f,i)=>(
// // // // // //             <div key={i} className="feature-card">
// // // // // //               <i className={`bi ${f.icon}`}></i>
// // // // // //               <h3>{f.title}</h3>
// // // // // //               <p>{f.desc}</p>
// // // // // //             </div>
// // // // // //           ))}
// // // // // //         </div>
// // // // // //       </main>

// // // // // //       {/* FOOTER */}
// // // // // //       <footer className="app-footer">
// // // // // //         <p>© 2025 SnapPatch Tracks. All rights reserved.</p>
// // // // // //         <div className="footer-links">
// // // // // //           <a href="#">Privacy Policy</a>
// // // // // //           <a href="#">Terms of Service</a>
// // // // // //           <a href="#">Contact Us</a>
// // // // // //         </div>
// // // // // //       </footer>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default App;





// // // // // import React, { useState, useEffect } from "react";
// // // // // import "./App.css";

// // // // // function App() {
// // // // //   // ─── SPLASH STATES ───
// // // // //   const [showSplash, setShowSplash]         = useState(true);
// // // // //   const [showLetters, setShowLetters]       = useState(false);
// // // // //   const [spreadLetters, setSpreadLetters]   = useState(false);
// // // // //   const [fadeSplash, setFadeSplash]         = useState(false);

// // // // //   // ─── MAIN APP STATES ───
// // // // //   const [activeStep, setActiveStep]         = useState(0);
// // // // //   const [selectedImage, setSelectedImage]   = useState(null);
// // // // //   const [isProcessing, setIsProcessing]     = useState(false);
// // // // //   const [progress, setProgress]             = useState(0);

// // // // //   // ─── SPLASH TIMING ───
// // // // //   useEffect(() => {
// // // // //     const drop   = setTimeout(() => setShowLetters(true), 300);
// // // // //     const spread = setTimeout(() => setSpreadLetters(true), 2200);
// // // // //     const fade   = setTimeout(() => setFadeSplash(true), 3000);
// // // // //     const hide   = setTimeout(() => setShowSplash(false), 3500);
// // // // //     return () => {
// // // // //       clearTimeout(drop);
// // // // //       clearTimeout(spread);
// // // // //       clearTimeout(fade);
// // // // //       clearTimeout(hide);
// // // // //     };
// // // // //   }, []);

// // // // //   // ─── PRINT PROGRESS ───
// // // // //   useEffect(() => {
// // // // //     let iv;
// // // // //     if (activeStep === 3) {
// // // // //       iv = setInterval(() => {
// // // // //         setProgress(p => (p >= 100 ? (clearInterval(iv), 100) : p + 5));
// // // // //       }, 300);
// // // // //     }
// // // // //     return () => clearInterval(iv);
// // // // //   }, [activeStep]);

// // // // //   // ─── HELPERS ───
// // // // //   const simulate = (cb, ms = 1500) => setTimeout(cb, ms);
// // // // //   const handleImageCapture = () => {
// // // // //     setIsProcessing(true);
// // // // //     simulate(() => {
// // // // //       setSelectedImage("/api/placeholder/400/300");
// // // // //       setIsProcessing(false);
// // // // //       setActiveStep(1);
// // // // //     });
// // // // //   };
// // // // //   const handleImageUpload = () => {
// // // // //     setIsProcessing(true);
// // // // //     simulate(() => {
// // // // //       setSelectedImage("/api/placeholder/400/300");
// // // // //       setIsProcessing(false);
// // // // //       setActiveStep(1);
// // // // //     });
// // // // //   };
// // // // //   const generatePatch = () => {
// // // // //     setIsProcessing(true);
// // // // //     simulate(() => {
// // // // //       setIsProcessing(false);
// // // // //       setActiveStep(2);
// // // // //     }, 2000);
// // // // //   };
// // // // //   const printPatch = () => {
// // // // //     setProgress(0);
// // // // //     setActiveStep(3);
// // // // //   };

// // // // //   // ─── RENDER SPLASH ───
// // // // //   if (showSplash) {
// // // // //     const title   = "SNAPPATCH";
// // // // //     const n       = title.length;
// // // // //     const spacing = 60;  // px between letters

// // // // //     return (
// // // // //       <div className={`splash ${fadeSplash ? "fade-out" : ""}`}>
// // // // //         <div className="splash-grid" />
// // // // //         <div className="splash-text">
// // // // //           {title.split("").map((ch, i) => {
// // // // //             const center = (n - 1) / 2;
// // // // //             const dx     = (i - center) * spacing;
// // // // //             const style  = {
// // // // //               opacity: showLetters ? 1 : 0,
// // // // //               transform: showLetters
// // // // //                 ? spreadLetters
// // // // //                   ? `translateX(${dx}px)`
// // // // //                   : "translateY(0)"
// // // // //                 : "translateY(-200px)",
// // // // //               transition: showLetters
// // // // //                 ? spreadLetters
// // // // //                   ? "transform 0.8s ease-out, opacity 0.8s ease-out"
// // // // //                   : `transform 0.6s ease-out ${0.1 * i}s, opacity 0.6s ease-out ${0.1 * i}s`
// // // // //                 : undefined
// // // // //             };
// // // // //             return (
// // // // //               <span key={i} className="letter" style={style}>
// // // // //                 {ch}
// // // // //               </span>
// // // // //             );
// // // // //           })}
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   // ─── RENDER MAIN UI ───
// // // // //   return (
// // // // //     <div className="app-container">
// // // // //       {/* HEADER */}
// // // // //       <header className="app-header">
// // // // //         <div className="header-inner">
// // // // //           <h1>SnapPatch Tracks</h1>
// // // // //           <p>AI-Powered Custom Wound Dressings</p>
// // // // //         </div>
// // // // //       </header>

// // // // //       {/* STEPS */}
// // // // //       <div className="steps container">
// // // // //         {["Capture","Process","Preview","Print"].map((step, idx) => (
// // // // //           <div key={idx} className="step">
// // // // //             <div className={`circle ${activeStep >= idx ? "active" : ""}`}>
// // // // //               {idx + 1}
// // // // //             </div>
// // // // //             <div className={`label ${activeStep >= idx ? "active" : ""}`}>
// // // // //               {step}
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}
// // // // //         <div className="progress-line">
// // // // //           <div
// // // // //             className="progress-bar"
// // // // //             style={{ width: `${(activeStep / 3) * 100}%` }}
// // // // //           />
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* CAPTURE CARD */}
// // // // //       <main className="app-main container">
// // // // //         <div className="capture-card">
// // // // //           <h2>Capture Your Wound</h2>
// // // // //           <p>Take a photo or upload an existing image to create your custom patch</p>
// // // // //           <div className="upload-area">
// // // // //             <i className="bi bi-camera"></i>
// // // // //             <p>Capture or upload your wound image here</p>
// // // // //             <p className="small">Images are secured and encrypted</p>
// // // // //           </div>
// // // // //           <div className="btn-row">
// // // // //             <button onClick={handleImageCapture} className="btn-modern">
// // // // //               <i className="bi bi-camera"></i> Take a Photo
// // // // //             </button>
// // // // //             <button onClick={handleImageUpload} className="btn-modern btn-light">
// // // // //               <i className="bi bi-upload"></i> Upload Image
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* FEATURES */}
// // // // //         <div className="features row">
// // // // //           {[
// // // // //             {
// // // // //               icon: "bi-camera",
// // // // //               title: "Instant Scanning",
// // // // //               desc: "On-device AI processes wound images and creates precise measurements instantly"
// // // // //             },
// // // // //             {
// // // // //               icon: "bi-eye",
// // // // //               title: "AR Preview",
// // // // //               desc: "See how your custom patch will fit before printing with our AR tool"
// // // // //             },
// // // // //             {
// // // // //               icon: "bi-printer",
// // // // //               title: "Quick Printing",
// // // // //               desc: "Print your custom patch in minutes with any 3D printer"
// // // // //             }
// // // // //           ].map((f, i) => (
// // // // //             <div key={i} className="feature-card">
// // // // //               <i className={`bi ${f.icon}`}></i>
// // // // //               <h3>{f.title}</h3>
// // // // //               <p>{f.desc}</p>
// // // // //             </div>
// // // // //           ))}
// // // // //         </div>
// // // // //       </main>

// // // // //       {/* FOOTER */}
// // // // //       <footer className="app-footer">
// // // // //         <p>© 2025 SnapPatch Tracks. All rights reserved.</p>
// // // // //         <div className="footer-links">
// // // // //           <a href="#">Privacy Policy</a>
// // // // //           <a href="#">Terms of Service</a>
// // // // //           <a href="#">Contact Us</a>
// // // // //         </div>
// // // // //       </footer>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default App;



// // // // import React, { useState, useEffect } from "react";
// // // // import axios from "axios";
// // // // import "./App.css";

// // // // function App() {
// // // //   // ─── SPLASH STATES ───
// // // //   const [showSplash, setShowSplash]       = useState(true);
// // // //   const [showLetters, setShowLetters]     = useState(false);
// // // //   const [spreadLetters, setSpreadLetters] = useState(false);
// // // //   const [fadeSplash, setFadeSplash]       = useState(false);

// // // //   // ─── MAIN APP STATES ───
// // // //   const [activeStep, setActiveStep]       = useState(0);
// // // //   const [selectedImage, setSelectedImage] = useState(null);
// // // //   const [isProcessing, setIsProcessing]   = useState(false);
// // // //   const [progress, setProgress]           = useState(0);
// // // //   const [stlPath, setStlPath]             = useState("");

// // // //   // ─── SPLASH TIMING ───
// // // //   useEffect(() => {
// // // //     const drop   = setTimeout(() => setShowLetters(true), 300);
// // // //     const spread = setTimeout(() => setSpreadLetters(true), 2200);
// // // //     const fade   = setTimeout(() => setFadeSplash(true), 3000);
// // // //     const hide   = setTimeout(() => setShowSplash(false), 3500);
// // // //     return () => [drop, spread, fade, hide].forEach(clearTimeout);
// // // //   }, []);

// // // //   // ─── PRINT PROGRESS ───
// // // //   useEffect(() => {
// // // //     let iv;
// // // //     if (activeStep === 3) {
// // // //       iv = setInterval(() => {
// // // //         setProgress(p => (p >= 100 ? (clearInterval(iv), 100) : p + 5));
// // // //       }, 300);
// // // //     }
// // // //     return () => clearInterval(iv);
// // // //   }, [activeStep]);

// // // //   // ─── FILE PICKER HELPER ───
// // // //   const pickFile = () =>
// // // //     new Promise(resolve => {
// // // //       const input = document.createElement("input");
// // // //       input.type = "file";
// // // //       input.accept = "image/*";
// // // //       input.capture = "environment";
// // // //       input.onchange = () => resolve(input.files[0]);
// // // //       input.click();
// // // //     });

// // // //   // ─── 1️⃣ Capture / Upload → /api/segment ───
// // // //   const handleImageCapture = async () => {
// // // //     const file = await pickFile();
// // // //     if (!file) return;
// // // //     setIsProcessing(true);
// // // //     try {
// // // //       const form = new FormData();
// // // //       form.append("file", file);
// // // //       const { data } = await axios.post("/api/segment", form, {
// // // //         headers: { "Content-Type": "multipart/form-data" },
// // // //       });
// // // //       setSelectedImage(`data:image/png;base64,${data.mask}`);
// // // //       setActiveStep(1);
// // // //     } catch (err) {
// // // //       console.error("Segmentation failed:", err);
// // // //       alert("Segmentation failed. See console.");
// // // //     } finally {
// // // //       setIsProcessing(false);
// // // //     }
// // // //   };
// // // //   const handleImageUpload = handleImageCapture; // same picker

// // // //   // ─── 2️⃣ Generate Patch → /api/generate ───
// // // //   const generatePatch = async () => {
// // // //     setIsProcessing(true);
// // // //     try {
// // // //       const { data } = await axios.post(
// // // //         "/api/generate",
// // // //         null,
// // // //         { params: { style: "cube", size: 1.0 } }
// // // //       );
// // // //       // data.file_path = "generated_stls/…"
// // // //       setStlPath(data.file_path.split("/").pop());
// // // //       setActiveStep(2);
// // // //     } catch (err) {
// // // //       console.error("Generation failed:", err);
// // // //       alert("Patch generation failed.");
// // // //     } finally {
// // // //       setIsProcessing(false);
// // // //     }
// // // //   };

// // // //   // ─── 3️⃣ Print → /api/print ───
// // // //   const printPatch = async () => {
// // // //     setProgress(0);
// // // //     setActiveStep(3);
// // // //     try {
// // // //       await axios.post(
// // // //         "/api/print",
// // // //         null,
// // // //         { params: { stl_url: `/generated_stls/${stlPath}` } }
// // // //       );
// // // //     } catch (err) {
// // // //       console.error("Print failed:", err);
// // // //       alert("Print failed.");
// // // //     }
// // // //   };

// // // //   // ─── RENDER SPLASH ───
// // // //   if (showSplash) {
// // // //     const title   = "SNAPPATCH";
// // // //     const n       = title.length;
// // // //     const spacing = 60;

// // // //     return (
// // // //       <div className={`splash ${fadeSplash ? "fade-out" : ""}`}>
// // // //         <div className="splash-grid" />
// // // //         <div className="splash-text">
// // // //           {title.split("").map((ch, i) => {
// // // //             const center = (n - 1) / 2;
// // // //             const dx     = (i - center) * spacing;
// // // //             const style  = {
// // // //               opacity: showLetters ? 1 : 0,
// // // //               transform: showLetters
// // // //                 ? spreadLetters
// // // //                   ? `translateX(${dx}px)`
// // // //                   : "translateY(0)"
// // // //                 : "translateY(-200px)",
// // // //               transition: showLetters
// // // //                 ? spreadLetters
// // // //                   ? "transform 0.8s ease-out, opacity 0.8s ease-out"
// // // //                   : `transform 0.6s ease-out ${0.1 * i}s, opacity 0.6s ease-out ${0.1 * i}s`
// // // //                 : undefined
// // // //             };
// // // //             return (
// // // //               <span key={i} className="letter" style={style}>
// // // //                 {ch}
// // // //               </span>
// // // //             );
// // // //           })}
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   // ─── RENDER MAIN UI ───
// // // //   return (
// // // //     <div className="app-container">
// // // //       {/* HEADER */}
// // // //       <header className="app-header">
// // // //         <div className="header-inner">
// // // //           <h1>SnapPatch Tracks</h1>
// // // //           <p>AI-Powered Custom Wound Dressings</p>
// // // //         </div>
// // // //       </header>

// // // //       {/* STEPS */}
// // // //       <div className="steps container">
// // // //         {["Capture","Process","Preview","Print"].map((step, idx) => (
// // // //           <div key={idx} className="step">
// // // //             <div className={`circle ${activeStep >= idx ? "active" : ""}`}>
// // // //               {idx + 1}
// // // //             </div>
// // // //             <div className={`label ${activeStep >= idx ? "active" : ""}`}>
// // // //               {step}
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //         <div className="progress-line">
// // // //           <div
// // // //             className="progress-bar"
// // // //             style={{ width: `${(activeStep / 3) * 100}%` }}
// // // //           />
// // // //         </div>
// // // //       </div>

// // // //       {/* CAPTURE CARD */}
// // // //       <main className="app-main container">
// // // //         <div className="capture-card">
// // // //           <h2>Capture Your Wound</h2>
// // // //           <p>Take a photo or upload an existing image to create your custom patch</p>
// // // //           <div className="upload-area">
// // // //             <i className="bi bi-camera"></i>
// // // //             <p>Capture or upload your wound image here</p>
// // // //             <p className="small">Images are secured and encrypted</p>
// // // //           </div>
// // // //           <div className="btn-row">
// // // //             <button onClick={handleImageCapture} className="btn-modern" disabled={isProcessing}>
// // // //               <i className="bi bi-camera"></i> Take a Photo
// // // //             </button>
// // // //             <button onClick={handleImageUpload} className="btn-modern btn-light" disabled={isProcessing}>
// // // //               <i className="bi bi-upload"></i> Upload Image
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* FEATURES (only on step 0) */}
// // // //         {activeStep === 0 && (
// // // //           <div className="features row">
// // // //             {[
// // // //               {
// // // //                 icon: "bi-camera",
// // // //                 title: "Instant Scanning",
// // // //                 desc: "On-device AI processes wound images and creates precise measurements instantly"
// // // //               },
// // // //               {
// // // //                 icon: "bi-eye",
// // // //                 title: "AR Preview",
// // // //                 desc: "See how your custom patch will fit before printing with our AR tool"
// // // //               },
// // // //               {
// // // //                 icon: "bi-printer",
// // // //                 title: "Quick Printing",
// // // //                 desc: "Print your custom patch in minutes with any 3D printer"
// // // //               }
// // // //             ].map((f, i) => (
// // // //               <div key={i} className="feature-card">
// // // //                 <i className={`bi ${f.icon}`}></i>
// // // //                 <h3>{f.title}</h3>
// // // //                 <p>{f.desc}</p>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         )}

// // // //         {/* STEP 1: Show segmented image */}
// // // //         {activeStep === 1 && (
// // // //           <div className="text-center mt-4">
// // // //             <h2>AI Processing</h2>
// // // //             <img src={selectedImage} alt="Segmentation Mask" className="img-fluid mb-4" style={{ maxHeight: 300 }} />
// // // //             <button onClick={generatePatch} className="btn btn-primary" disabled={isProcessing}>
// // // //               {isProcessing ? "Generating…" : "Generate Patch"}
// // // //             </button>
// // // //           </div>
// // // //         )}

// // // //         {/* STEP 2: Preview patch (reuse image) */}
// // // //         {activeStep === 2 && (
// // // //           <div className="text-center mt-4">
// // // //             <h2>Preview Your Custom Patch</h2>
// // // //             <img src={selectedImage} alt="Patch Preview" className="img-fluid mb-4" style={{ maxHeight: 300 }} />
// // // //             <button onClick={printPatch} className="btn btn-success">Print Patch</button>
// // // //           </div>
// // // //         )}

// // // //         {/* STEP 3: Print progress */}
// // // //         {activeStep === 3 && (
// // // //           <div className="text-center mt-4">
// // // //             <h2>Printing Your Patch</h2>
// // // //             <div className="progress my-4" style={{ height: 20 }}>
// // // //               <div className="progress-bar" style={{ width: `${progress}%` }}>
// // // //                 {progress}%
// // // //               </div>
// // // //             </div>
// // // //             {progress === 100 && (
// // // //               <button
// // // //                 onClick={() => {
// // // //                   setActiveStep(0);
// // // //                   setSelectedImage(null);
// // // //                   setProgress(0);
// // // //                   setStlPath("");
// // // //                 }}
// // // //                 className="btn btn-outline-primary"
// // // //               >
// // // //                 Start New
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //         )}
// // // //       </main>

// // // //       {/* FOOTER */}
// // // //       <footer className="app-footer">
// // // //         <p>© 2025 SnapPatch Tracks. All rights reserved.</p>
// // // //         <div className="footer-links">
// // // //           <a href="#">Privacy Policy</a>
// // // //           <a href="#">Terms of Service</a>
// // // //           <a href="#">Contact Us</a>
// // // //         </div>
// // // //       </footer>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default App;



// // // // frontend/src/App.js

// // // import React, { useState, useEffect } from "react";
// // // import axios from "axios";
// // // import "./App.css";

// // // function App() {
// // //   // ─── SPLASH STATES ───
// // //   const [showSplash, setShowSplash]       = useState(true);
// // //   const [showLetters, setShowLetters]     = useState(false);
// // //   const [spreadLetters, setSpreadLetters] = useState(false);
// // //   const [fadeSplash, setFadeSplash]       = useState(false);

// // //   // ─── MAIN APP STATES ───
// // //   const [activeStep, setActiveStep]       = useState(0);
// // //   const [selectedImage, setSelectedImage] = useState(null);
// // //   const [isProcessing, setIsProcessing]   = useState(false);
// // //   const [progress, setProgress]           = useState(0);
// // //   const [stlPath, setStlPath]             = useState("");

// // //   // ─── SPLASH TIMING ───
// // //   useEffect(() => {
// // //     const drop   = setTimeout(() => setShowLetters(true), 300);
// // //     const spread = setTimeout(() => setSpreadLetters(true), 2200);
// // //     const fade   = setTimeout(() => setFadeSplash(true), 3000);
// // //     const hide   = setTimeout(() => setShowSplash(false), 3500);
// // //     return () => [drop, spread, fade, hide].forEach(clearTimeout);
// // //   }, []);

// // //   // ─── PRINT PROGRESS ───
// // //   useEffect(() => {
// // //     let iv;
// // //     if (activeStep === 3) {
// // //       iv = setInterval(() => {
// // //         setProgress(p => (p >= 100 ? (clearInterval(iv), 100) : p + 5));
// // //       }, 300);
// // //     }
// // //     return () => clearInterval(iv);
// // //   }, [activeStep]);

// // //   // ─── FILE PICKER HELPER ───
// // //   const pickFile = () =>
// // //     new Promise(resolve => {
// // //       const input = document.createElement("input");
// // //       input.type = "file";
// // //       input.accept = "image/*";
// // //       input.capture = "environment";
// // //       input.onchange = () => resolve(input.files[0]);
// // //       input.click();
// // //     });

// // //   // ─── 1️⃣ Capture / Upload → /api/segment ───
// // //   const handleImageCapture = async () => {
// // //     const file = await pickFile();
// // //     if (!file) return;
// // //     setIsProcessing(true);
// // //     try {
// // //       const form = new FormData();
// // //       form.append("file", file);
// // //       const { data } = await axios.post("/api/segment", form, {
// // //         headers: { "Content-Type": "multipart/form-data" },
// // //       });
// // //       setSelectedImage(`data:image/png;base64,${data.mask}`);
// // //       setActiveStep(1);
// // //     } catch (err) {
// // //       console.error("Segmentation failed:", err);
// // //       alert("Segmentation failed. Check console for details.");
// // //     } finally {
// // //       setIsProcessing(false);
// // //     }
// // //   };
// // //   const handleImageUpload = handleImageCapture;

// // //   // ─── 2️⃣ Generate Patch → /api/generate ───
// // //   const generatePatch = async () => {
// // //     setIsProcessing(true);
// // //     try {
// // //       const { data } = await axios.post(
// // //         "/api/generate",
// // //         null,
// // //         { params: { style: "cube", size: 1.0 } }
// // //       );
// // //       // data.file_path = "generated_stls/…"
// // //       setStlPath(data.file_path.split("/").pop());
// // //       setActiveStep(2);
// // //     } catch (err) {
// // //       console.error("Generation failed:", err);
// // //       alert("Patch generation failed.");
// // //     } finally {
// // //       setIsProcessing(false);
// // //     }
// // //   };

// // //   // ─── 3️⃣ Print → /api/print ───
// // //   const printPatch = async () => {
// // //     setProgress(0);
// // //     setActiveStep(3);
// // //     try {
// // //       await axios.post(
// // //         "/api/print",
// // //         null,
// // //         { params: { stl_url: `/generated_stls/${stlPath}` } }
// // //       );
// // //     } catch (err) {
// // //       console.error("Print failed:", err);
// // //       alert("Print request failed.");
// // //     }
// // //   };

// // //   // ─── RENDER SPLASH ───
// // //   if (showSplash) {
// // //     const title   = "SNAPPATCH";
// // //     const n       = title.length;
// // //     const spacing = 60;

// // //     return (
// // //       <div className={`splash ${fadeSplash ? "fade-out" : ""}`}>
// // //         <div className="splash-grid" />
// // //         <div className="splash-text">
// // //           {title.split("").map((ch, i) => {
// // //             const center = (n - 1) / 2;
// // //             const dx     = (i - center) * spacing;
// // //             const style  = {
// // //               opacity: showLetters ? 1 : 0,
// // //               transform: showLetters
// // //                 ? spreadLetters
// // //                   ? `translateX(${dx}px)`
// // //                   : "translateY(0)"
// // //                 : "translateY(-200px)",
// // //               transition: showLetters
// // //                 ? spreadLetters
// // //                   ? "transform 0.8s ease-out, opacity 0.8s ease-out"
// // //                   : `transform 0.6s ease-out ${0.1 * i}s, opacity 0.6s ease-out ${0.1 * i}s`
// // //                 : undefined
// // //             };
// // //             return (
// // //               <span key={i} className="letter" style={style}>
// // //                 {ch}
// // //               </span>
// // //             );
// // //           })}
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ─── RENDER MAIN UI ───
// // //   return (
// // //     <div className="app-container">
// // //       {/* HEADER */}
// // //       <header className="app-header">
// // //         <div className="header-inner">
// // //           <h1>SnapPatch Tracks</h1>
// // //           <p>AI-Powered Custom Wound Dressings</p>
// // //         </div>
// // //       </header>

// // //       {/* STEPS */}
// // //       <div className="steps container">
// // //         {["Capture","Process","Preview","Print"].map((lbl, idx) => (
// // //           <div key={idx} className="step">
// // //             <div className={`circle ${activeStep >= idx ? "active" : ""}`}>
// // //               {idx + 1}
// // //             </div>
// // //             <div className={`label ${activeStep >= idx ? "active" : ""}`}>
// // //               {lbl}
// // //             </div>
// // //           </div>
// // //         ))}
// // //         <div className="progress-line">
// // //           <div
// // //             className="progress-bar"
// // //             style={{ width: `${(activeStep / 3) * 100}%` }}
// // //           />
// // //         </div>
// // //       </div>

// // //       {/* MAIN CONTENT */}
// // //       <main className="app-main container">
// // //         {/* Step 0: Capture */}
// // //         {activeStep === 0 && (
// // //           <div className="capture-card">
// // //             <h2>Capture Your Wound</h2>
// // //             <p>Take a photo or upload an existing image to create your custom patch</p>
// // //             <div className="upload-area">
// // //               <i className="bi bi-camera"></i>
// // //               <p>Capture or upload your wound image here</p>
// // //               <p className="small">Images are secured and encrypted</p>
// // //             </div>
// // //             <div className="btn-row">
// // //               <button onClick={handleImageCapture}
// // //                       className="btn-modern"
// // //                       disabled={isProcessing}>
// // //                 <i className="bi bi-camera"></i> Take a Photo
// // //               </button>
// // //               <button onClick={handleImageUpload}
// // //                       className="btn-modern btn-light"
// // //                       disabled={isProcessing}>
// // //                 <i className="bi bi-upload"></i> Upload Image
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Step 1: Preview Mask */}
// // //         {activeStep === 1 && (
// // //           <div className="text-center mt-4">
// // //             <h2>AI Processing</h2>
// // //             <img src={selectedImage}
// // //                  alt="Segmentation Mask"
// // //                  className="img-fluid mb-4"
// // //                  style={{ maxHeight: 300 }} />
// // //             <button onClick={generatePatch}
// // //                     className="btn btn-primary"
// // //                     disabled={isProcessing}>
// // //               {isProcessing ? "Generating…" : "Generate Patch"}
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Step 2: Preview Patch */}
// // //         {activeStep === 2 && (
// // //           <div className="text-center mt-4">
// // //             <h2>Preview Your Custom Patch</h2>
// // //             <img src={selectedImage}
// // //                  alt="Patch Preview"
// // //                  className="img-fluid mb-4"
// // //                  style={{ maxHeight: 300 }} />
// // //             <button onClick={printPatch}
// // //                     className="btn btn-success">
// // //               Print Patch
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Step 3: Print Progress */}
// // //         {activeStep === 3 && (
// // //           <div className="text-center mt-4">
// // //             <h2>Printing Your Patch</h2>
// // //             <div className="progress my-4" style={{ height: 20 }}>
// // //               <div className="progress-bar" style={{ width: `${progress}%` }}>
// // //                 {progress}%
// // //               </div>
// // //             </div>
// // //             {progress === 100 && (
// // //               <button onClick={() => {
// // //                 setActiveStep(0);
// // //                 setSelectedImage(null);
// // //                 setProgress(0);
// // //                 setStlPath("");
// // //               }} className="btn btn-outline-primary">
// // //                 Start New
// // //               </button>
// // //             )}
// // //           </div>
// // //         )}
// // //       </main>

// // //       {/* FOOTER */}
// // //       <footer className="app-footer">
// // //         <p>© 2025 SnapPatch Tracks. All rights reserved.</p>
// // //         <div className="footer-links">
// // //           <a href="#">Privacy Policy</a>
// // //           <a href="#">Terms of Service</a>
// // //           <a href="#">Contact Us</a>
// // //         </div>
// // //       </footer>
// // //     </div>
// // //   );
// // // }

// // // export default App;



// // // frontend/src/App.js
// // import React, { useState, useEffect, useRef } from "react";
// // import axios from "axios";
// // import "./App.css";

// // function App() {
// //   // ─── SPLASH STATES ───
// //   const [showSplash, setShowSplash]       = useState(true);
// //   const [showLetters, setShowLetters]     = useState(false);
// //   const [spreadLetters, setSpreadLetters] = useState(false);
// //   const [fadeSplash, setFadeSplash]       = useState(false);

// //   // ─── MAIN APP STATES ───
// //   const [activeStep, setActiveStep]       = useState(0);
// //   const [selectedImage, setSelectedImage] = useState(null);      // original upload
// //   const [maskImage, setMaskImage]         = useState(null);      // returned mask
// //   const [isProcessing, setIsProcessing]   = useState(false);
// //   const [progress, setProgress]           = useState(0);

// //   const fileInputRef = useRef();

// //   // ─── SPLASH TIMING ───
// //   useEffect(() => {
// //     const drop   = setTimeout(() => setShowLetters(true), 300);
// //     const spread = setTimeout(() => setSpreadLetters(true), 2200);
// //     const fade   = setTimeout(() => setFadeSplash(true), 3000);
// //     const hide   = setTimeout(() => setShowSplash(false), 3500);
// //     return () => {
// //       clearTimeout(drop);
// //       clearTimeout(spread);
// //       clearTimeout(fade);
// //       clearTimeout(hide);
// //     };
// //   }, []);

// //   // ─── PRINT PROGRESS ───
// //   useEffect(() => {
// //     let iv;
// //     if (activeStep === 3) {
// //       iv = setInterval(() => {
// //         setProgress(p => (p >= 100 ? (clearInterval(iv), 100) : p + 5));
// //       }, 300);
// //     }
// //     return () => clearInterval(iv);
// //   }, [activeStep]);

// //   // ─── HANDLE FILE SELECTION ───
// //   const onFileSelected = async (file) => {
// //     setIsProcessing(true);
// //     setSelectedImage(URL.createObjectURL(file));
// //     // 1) Upload to /api/segment
// //     const form = new FormData();
// //     form.append("file", file);
// //     try {
// //       const { data } = await axios.post("/api/segment", form, {
// //         headers: { "Content-Type": "multipart/form-data" }
// //       });
// //       // data.mask is base64 PNG data URI
// //       setMaskImage(data.mask);
// //       setActiveStep(1);
// //     } catch (err) {
// //       console.error("Segmentation failed:", err);
// //       alert("Segmentation failed. See console.");
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   // ─── BUTTON CALLBACKS ───
// //   const handleImageCapture = () => {
// //     // trigger file input camera mode (on mobile)
// //     fileInputRef.current.accept = "image/*;capture=camera";
// //     fileInputRef.current.click();
// //   };
// //   const handleImageUpload = () => {
// //     fileInputRef.current.accept = "image/*";
// //     fileInputRef.current.click();
// //   };

// //   const generatePatch = async () => {
// //     setIsProcessing(true);
// //     try {
// //       const { data } = await axios.post("/api/generate?style=cube&size=1.0");
// //       console.log("STL generated at", data.file_path);
// //       setActiveStep(2);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Generate failed");
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const printPatch = async () => {
// //     setProgress(0);
// //     setActiveStep(3);
// //     try {
// //       await axios.post(`/api/print?stl_url=generated_stls/cube_${new Date().toISOString().replace(/[:.]/g,'')}.stl`);
// //       console.log("Print started");
// //     } catch (err) {
// //       console.error(err);
// //       alert("Print failed");
// //     }
// //   };

// //   // ─── RENDER SPLASH ───
// //   if (showSplash) {
// //     const title   = "SNAPPATCH";
// //     const n       = title.length;
// //     const spacing = 60;
// //     return (
// //       <div className={`splash ${fadeSplash ? "fade-out" : ""}`}>
// //         <div className="splash-grid" />
// //         <div className="splash-text">
// //           {title.split("").map((ch,i) => {
// //             const center = (n-1)/2, dx = (i-center)*spacing;
// //             const style = {
// //               opacity: showLetters ? 1 : 0,
// //               transform: showLetters
// //                 ? spreadLetters
// //                   ? `translateX(${dx}px)`
// //                   : "translateY(0)"
// //                 : "translateY(-200px)",
// //               transition: showLetters
// //                 ? spreadLetters
// //                   ? "transform 0.8s ease-out, opacity 0.8s ease-out"
// //                   : `transform 0.6s ease-out ${0.1*i}s, opacity 0.6s ease-out ${0.1*i}s`
// //                 : undefined
// //             };
// //             return <span key={i} className="letter" style={style}>{ch}</span>;
// //           })}
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ─── RENDER MAIN UI ───
// //   return (
// //     <div className="app-container">
// //       {/* hidden file input */}
// //       <input
// //         ref={fileInputRef}
// //         type="file"
// //         style={{ display: "none" }}
// //         onChange={e => e.target.files[0] && onFileSelected(e.target.files[0])}
// //       />

// //       {/* HEADER */}
// //       <header className="app-header">
// //         <div className="header-inner">
// //           <h1>SnapPatch Tracks</h1>
// //           <p>AI-Powered Custom Wound Dressings</p>
// //         </div>
// //       </header>

// //       {/* STEPS */}
// //       <div className="steps container">
// //         {["Capture","Process","Preview","Print"].map((step,idx)=>(
// //           <div key={idx} className="step">
// //             <div className={`circle ${activeStep>=idx?"active":""}`}>{idx+1}</div>
// //             <div className={`label ${activeStep>=idx?"active":""}`}>{step}</div>
// //           </div>
// //         ))}
// //         <div className="progress-line">
// //           <div className="progress-bar" style={{width:`${(activeStep/3)*100}%`}}/>
// //         </div>
// //       </div>

// //       {/* MAIN */}
// //       <main className="app-main container">
// //         {activeStep===0 && (
// //           <div className="capture-card">
// //             <h2>Capture Your Wound</h2>
// //             <p>Take a photo or upload an existing image to create your custom patch</p>
// //             <div className="upload-area">
// //               <i className="bi bi-camera" />
// //               <p>Capture or upload your wound image here</p>
// //               <p className="small">Images are secured and encrypted</p>
// //             </div>
// //             <div className="btn-row">
// //               <button onClick={handleImageCapture} className="btn-modern">
// //                 <i className="bi bi-camera" /> Take a Photo
// //               </button>
// //               <button onClick={handleImageUpload} className="btn-modern btn-light">
// //                 <i className="bi bi-upload" /> Upload Image
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {activeStep===1 && (
// //           <div className="text-center mt-5">
// //             <h2>AI Processing</h2>
// //             <p>Our AI is analyzing your wound…</p>
// //             {isProcessing
// //               ? <div className="spinner-border text-info" role="status" />
// //               : maskImage && <img src={maskImage} alt="Mask" className="img-fluid mt-3" style={{maxWidth:300}} />
// //             }
// //             <div className="mt-4">
// //               <button onClick={generatePatch} disabled={isProcessing} className="btn-modern">
// //                 <i className="bi bi-sliders" /> Generate Patch
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {activeStep===2 && (
// //           <div className="text-center mt-5">
// //             <h2>Preview Your Custom Patch</h2>
// //             <p>Looks good? Let’s print it.</p>
// //             <button onClick={printPatch} className="btn-modern">
// //               <i className="bi bi-printer" /> Print Patch
// //             </button>
// //           </div>
// //         )}

// //         {activeStep===3 && (
// //           <div className="text-center mt-5">
// //             <h2>Printing Your Patch</h2>
// //             <p>Sending to printer…</p>
// //             <div className="progress mb-3" style={{height: "10px"}}>
// //               <div className="progress-bar" role="progressbar" style={{width:`${progress}%`}}/>
// //             </div>
// //             <p>{progress}%</p>
// //             {progress===100 && (
// //               <button onClick={()=>{setActiveStep(0); setMaskImage(null); setSelectedImage(null)}} className="btn-modern">
// //                 Start New Patch
// //               </button>
// //             )}
// //           </div>
// //         )}
// //       </main>

// //       {/* FOOTER */}
// //       <footer className="app-footer">
// //         <p>© 2025 SnapPatch Tracks. All rights reserved.</p>
// //         <div className="footer-links">
// //           <a href="#">Privacy Policy</a>
// //           <a href="#">Terms of Service</a>
// //           <a href="#">Contact Us</a>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // }

// // export default App;



// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   // ─── SPLASH STATES ───
//   const [showSplash, setShowSplash]         = useState(true);
//   const [showLetters, setShowLetters]       = useState(false);
//   const [spreadLetters, setSpreadLetters]   = useState(false);
//   const [fadeSplash, setFadeSplash]         = useState(false);

//   // ─── MAIN APP STATES ───
//   const [activeStep, setActiveStep]         = useState(0);
//   const [selectedImage, setSelectedImage]   = useState(null);
//   const [maskImage, setMaskImage]           = useState(null);
//   const [isProcessing, setIsProcessing]     = useState(false);
//   const [progress, setProgress]             = useState(0);

//   // we need a ref to clear the file input after each pick:
//   const fileInputRef = useRef();

//   // ─── SPLASH TIMING ───
//   useEffect(() => {
//     const drop   = setTimeout(() => setShowLetters(true), 300);
//     const spread = setTimeout(() => setSpreadLetters(true), 2200);
//     const fade   = setTimeout(() => setFadeSplash(true), 3000);
//     const hide   = setTimeout(() => setShowSplash(false), 3500);
//     return () => {
//       clearTimeout(drop);
//       clearTimeout(spread);
//       clearTimeout(fade);
//       clearTimeout(hide);
//     };
//   }, []);

//   // ─── PRINT PROGRESS ───
//   useEffect(() => {
//     let iv;
//     if (activeStep === 3) {
//       iv = setInterval(() => {
//         setProgress(p => (p >= 100 ? (clearInterval(iv), 100) : p + 5));
//       }, 300);
//     }
//     return () => clearInterval(iv);
//   }, [activeStep]);

//   // ─── HELPERS ───
//   const simulate = (cb, ms = 1500) => setTimeout(cb, ms);

//   const onFileSelected = async (file) => {
//     setIsProcessing(true);
//     setSelectedImage(URL.createObjectURL(file));
//     const form = new FormData();
//     form.append("file", file);

//     try {
//       const { data } = await axios.post("/api/segment", form, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       setMaskImage(`data:image/png;base64,${data.mask}`);
//       setActiveStep(1);
//     } catch (err) {
//       console.error("Segmentation failed:", err);
//       alert("Segmentation failed. See console.");
//     } finally {
//       setIsProcessing(false);
//       // ← reset the input so picking the same file again re-fires onChange
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   const handleImageCapture = () => {
//     // stub for camera capture
//     fileInputRef.current?.click();
//   };

//   const handleImageUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const generatePatch = () => {
//     setIsProcessing(true);
//     simulate(() => {
//       setIsProcessing(false);
//       setActiveStep(2);
//     }, 2000);
//   };

//   const printPatch = () => {
//     setProgress(0);
//     setActiveStep(3);
//   };

//   // ─── RENDER SPLASH ───
//   if (showSplash) {
//     const title   = "SNAPPATCH";
//     const n       = title.length;
//     const spacing = 60;  // px between letters

//     return (
//       <div className={`splash ${fadeSplash ? "fade-out" : ""}`}>
//         <div className="splash-grid" />
//         <div className="splash-text">
//           {title.split("").map((ch, i) => {
//             const center = (n - 1) / 2;
//             const dx     = (i - center) * spacing;
//             const style  = {
//               opacity: showLetters ? 1 : 0,
//               transform: showLetters
//                 ? spreadLetters
//                   ? `translateX(${dx}px)`
//                   : "translateY(0)"
//                 : "translateY(-200px)",
//               transition: showLetters
//                 ? spreadLetters
//                   ? "transform 0.8s ease-out, opacity 0.8s ease-out"
//                   : `transform 0.6s ease-out ${0.1 * i}s, opacity 0.6s ease-out ${0.1 * i}s`
//                 : undefined
//             };
//             return (
//               <span key={i} className="letter" style={style}>
//                 {ch}
//               </span>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }

//   // ─── RENDER MAIN UI ───
//   return (
//     <div className="app-container">
//       {/* hidden file input */}
//       <input
//         type="file"
//         accept="image/*"
//         style={{ display: "none" }}
//         ref={fileInputRef}
//         onChange={e => {
//           if (e.target.files?.[0]) onFileSelected(e.target.files[0]);
//         }}
//       />

//       {/* HEADER */}
//       <header className="app-header">
//         <div className="header-inner">
//           <h1>SnapPatch Tracks</h1>
//           <p>AI-Powered Custom Wound Dressings</p>
//         </div>
//       </header>

//       {/* STEPS */}
//       <div className="steps container">
//         {["Capture","Process","Preview","Print"].map((step, idx) => (
//           <div key={idx} className="step">
//             <div className={`circle ${activeStep >= idx ? "active" : ""}`}>
//               {idx + 1}
//             </div>
//             <div className={`label ${activeStep >= idx ? "active" : ""}`}>
//               {step}
//             </div>
//           </div>
//         ))}
//         <div className="progress-line">
//           <div
//             className="progress-bar"
//             style={{ width: `${(activeStep / 3) * 100}%` }}
//           />
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <main className="app-main container">

//         {activeStep === 0 && (
//           <div className="capture-card">
//             <h2>Capture Your Wound</h2>
//             <p>Take a photo or upload an existing image to create your custom patch</p>
//             <div className="upload-area">
//               <i className="bi bi-camera"></i>
//               <p>Capture or upload your wound image here</p>
//               <p className="small">Images are secured and encrypted</p>
//             </div>
//             <div className="btn-row">
//               <button onClick={handleImageCapture} className="btn-modern">
//                 <i className="bi bi-camera"></i> Take a Photo
//               </button>
//               <button onClick={handleImageUpload} className="btn-modern btn-light">
//                 <i className="bi bi-upload"></i> Upload Image
//               </button>
//             </div>
//           </div>
//         )}

//         {activeStep === 1 && (
//           <div className="capture-card">
//             <h2>Processing…</h2>
//             <p>Your image is being analyzed</p>
//             {isProcessing
//               ? <div className="spinner" />
//               : <button onClick={generatePatch} className="btn-modern">Continue</button>
//             }
//           </div>
//         )}

//         {activeStep === 2 && (
//           <div className="preview-card">
//             <h2>Preview Your Custom Patch</h2>
//             <img src={maskImage} alt="Segmentation Mask" className="mask-preview" />
//             <button onClick={printPatch} className="btn-modern">Print Patch</button>
//           </div>
//         )}

//         {activeStep === 3 && (
//           <div className="print-card">
//             <h2>Printing…</h2>
//             <div className="progress-circle">
//               <svg width="80" height="80">
//                 <circle cx="40" cy="40" r="35" stroke="#e9ecef" strokeWidth="5" fill="none" />
//                 <circle
//                   cx="40" cy="40" r="35"
//                   stroke="#219ebc"
//                   strokeWidth="5"
//                   strokeDasharray="220"
//                   strokeDashoffset={(220 * (100 - progress)) / 100}
//                   transform="rotate(-90 40 40)"
//                 />
//               </svg>
//             </div>
//             <p>{progress}% Complete</p>
//           </div>
//         )}

//         {/* always show features row on steps 0 & 1 */}
//         {(activeStep === 0 || activeStep === 1) && (
//           <div className="features row">
//             {[
//               {
//                 icon: "bi-camera",
//                 title: "Instant Scanning",
//                 desc: "On-device AI processes wound images and creates precise measurements instantly"
//               },
//               {
//                 icon: "bi-eye",
//                 title: "AR Preview",
//                 desc: "See how your custom patch will fit before printing with our AR tool"
//               },
//               {
//                 icon: "bi-printer",
//                 title: "Quick Printing",
//                 desc: "Print your custom patch in minutes with any 3D printer"
//               }
//             ].map((f, i) => (
//               <div key={i} className="feature-card">
//                 <i className={`bi ${f.icon}`}></i>
//                 <h3>{f.title}</h3>
//                 <p>{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         )}

//       </main>

//       {/* FOOTER */}
//       <footer className="app-footer">
//         <p>© 2025 SnapPatch Tracks. All rights reserved.</p>
//         <div className="footer-links">
//           <a href="#">Privacy Policy</a>
//           <a href="#">Terms of Service</a>
//           <a href="#">Contact Us</a>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;



// frontend/src/App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // ─── SPLASH STATES ───
  const [showSplash, setShowSplash]         = useState(true);
  const [showLetters, setShowLetters]       = useState(false);
  const [spreadLetters, setSpreadLetters]   = useState(false);
  const [fadeSplash, setFadeSplash]         = useState(false);

  // ─── MAIN APP STATES ───
  const [activeStep, setActiveStep]         = useState(0);
  const [selectedImage, setSelectedImage]   = useState(null);
  const [maskImage, setMaskImage]           = useState(null);
  const [isProcessing, setIsProcessing]     = useState(false);
  const [progress, setProgress]             = useState(0);

  const fileInputRef = useRef();

  // ─── SPLASH TIMING ───
  useEffect(() => {
    const drop   = setTimeout(() => setShowLetters(true), 300);
    const spread = setTimeout(() => setSpreadLetters(true), 2200);
    const fade   = setTimeout(() => setFadeSplash(true), 3000);
    const hide   = setTimeout(() => setShowSplash(false), 3500);
    return () => {
      clearTimeout(drop);
      clearTimeout(spread);
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, []);

  // ─── PRINT PROGRESS ───
  useEffect(() => {
    let iv;
    if (activeStep === 3) {
      iv = setInterval(() => {
        setProgress(p => (p >= 100 ? (clearInterval(iv), 100) : p + 5));
      }, 300);
    }
    return () => clearInterval(iv);
  }, [activeStep]);

  // ─── FILE UPLOAD HANDLER ───
  const onFileSelected = async (file) => {
    setIsProcessing(true);
    setSelectedImage(URL.createObjectURL(file));

    const form = new FormData();
    form.append("file", file);

    try {
      const { data } = await axios.post("/api/segment", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // data.mask is already a base64 string
      setMaskImage(`data:image/png;base64,${data.mask}`);
      setActiveStep(1);
    } catch (err) {
      console.error("Segmentation failed:", err);
      alert("Segmentation failed. See console.");
    } finally {
      setIsProcessing(false);
      // clear input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ─── BUTTON CALLBACKS ───
  const handleImageCapture = () => {
    const inp = fileInputRef.current;
    inp.setAttribute("accept", "image/*");
    inp.setAttribute("capture", "environment");
    inp.click();
  };
  const handleImageUpload = () => {
    const inp = fileInputRef.current;
    inp.setAttribute("accept", "image/*");
    inp.removeAttribute("capture");
    inp.click();
  };

  const generatePatch = async () => {
    setIsProcessing(true);
    try {
      await axios.post("/api/generate?style=cube&size=1.0");
      setActiveStep(2);
    } catch (err) {
      console.error(err);
      alert("Generate failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const printPatch = async () => {
    setProgress(0);
    setActiveStep(3);
    try {
      await axios.post("/api/print?stl_url=generated_stls/cube_dummy.stl");
    } catch (err) {
      console.error(err);
      alert("Print failed");
    }
  };

  // ─── RENDER SPLASH ───
  if (showSplash) {
    const title   = "SNAPPATCH";
    const n       = title.length;
    const spacing = 60;
    return (
      <div className={`splash ${fadeSplash ? "fade-out" : ""}`}>
        <div className="splash-grid" />
        <div className="splash-text">
          {title.split("").map((ch, i) => {
            const center = (n - 1) / 2;
            const dx = (i - center) * spacing;
            const style = {
              opacity: showLetters ? 1 : 0,
              transform: showLetters
                ? spreadLetters
                  ? `translateX(${dx}px)`
                  : "translateY(0)"
                : "translateY(-200px)",
              transition: showLetters
                ? spreadLetters
                  ? "transform 0.8s ease-out, opacity 0.8s ease-out"
                  : `transform 0.6s ease-out ${0.1 * i}s, opacity 0.6s ease-out ${0.1 * i}s`
                : undefined
            };
            return (
              <span key={i} className="letter" style={style}>
                {ch}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── RENDER MAIN UI ───
  return (
    <div className="app-container">
      {/* Hidden file input */}
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={e => e.target.files[0] && onFileSelected(e.target.files[0])}
      />

      {/* HEADER */}
      <header className="app-header">
        <div className="header-inner">
          <h1>SnapPatch Tracks</h1>
          <p>AI-Powered Custom Wound Dressings</p>
        </div>
      </header>

      {/* STEPS */}
      <div className="steps container">
        {["Capture","Process","Preview","Print"].map((step, idx) => (
          <div key={idx} className="step">
            <div className={`circle ${activeStep >= idx ? "active" : ""}`}>
              {idx + 1}
            </div>
            <div className={`label ${activeStep >= idx ? "active" : ""}`}>
              {step}
            </div>
          </div>
        ))}
        <div className="progress-line">
          <div
            className="progress-bar"
            style={{ width: `${(activeStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="app-main container">
        {activeStep === 0 && (
          <div className="capture-card">
            <h2>Capture Your Wound</h2>
            <p>Take a photo or upload an existing image to create your custom patch</p>
            <div className="upload-area">
              <i className="bi bi-camera"></i>
              <p>Capture or upload your wound image here</p>
              <p className="small">Images are secured and encrypted</p>
            </div>
            <div className="btn-row">
              <button onClick={handleImageCapture} className="btn-modern">
                <i className="bi bi-camera"></i> Take a Photo
              </button>
              <button onClick={handleImageUpload} className="btn-modern btn-light">
                <i className="bi bi-upload"></i> Upload Image
              </button>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="processing-card text-center mt-5">
            <h2>AI Processing</h2>
            <p>Our AI is analyzing your wound…</p>
            {isProcessing
              ? <div className="spinner-border text-info" role="status" />
              : <button onClick={generatePatch} className="btn-modern">
                  Generate Patch
                </button>
            }
          </div>
        )}

        {activeStep === 2 && (
          <div className="preview-card text-center mt-5">
            <h2>Preview Your Custom Patch</h2>
            {maskImage && (
              <img src={maskImage} alt="Segmentation Mask" className="img-fluid mb-3" style={{maxWidth:300}} />
            )}
            <button onClick={printPatch} className="btn-modern">
              Print Patch
            </button>
          </div>
        )}

        {activeStep === 3 && (
          <div className="print-card text-center mt-5">
            <h2>Printing Your Patch</h2>
            <div className="progress-circle mb-3">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="35" stroke="#e9ecef" strokeWidth="5" fill="none" />
                <circle
                  cx="40" cy="40" r="35"
                  stroke="#219ebc" strokeWidth="5"
                  strokeDasharray="220"
                  strokeDashoffset={(220*(100-progress))/100}
                  transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dashoffset 0.3s ease" }}
                />
              </svg>
            </div>
            <p>{progress}% Complete</p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>© 2025 SnapPatch Tracks. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
