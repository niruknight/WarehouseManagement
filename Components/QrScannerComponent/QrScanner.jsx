
// import React, { useState, useEffect, useRef } from 'react';
// import './QrScanner.css';

// const QrScanner = ({ onScan }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [scanning, setScanning] = useState(false);
//   const [error, setError] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [jsQRLoaded, setJsQRLoaded] = useState(false);

//   // Load jsQR on component mount
//   useEffect(() => {
//     if (!window.jsQR) {
//       const script = document.createElement('script');
//       script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
//       script.async = true;
      
//       script.onload = () => {
//         console.log('jsQR library loaded successfully');
//         setJsQRLoaded(true);
//       };
      
//       script.onerror = () => {
//         console.error('Failed to load jsQR library');
//         setError('Failed to load barcode scanning library. Please refresh and try again.');
//       };
      
//       document.body.appendChild(script);
//     } else {
//       setJsQRLoaded(true);
//     }
    
//     return () => {
//       stopScanner();
//     };
//   }, []);

//   // Auto-start scanner when jsQR is loaded
//   useEffect(() => {
//     if (jsQRLoaded) {
//       startScanner();
//     }
//   }, [jsQRLoaded]);

//   const startScanner = async () => {
//     if (scanning) return; // Prevent multiple starts
    
//     try {
//       setError(null);
//       setScanning(true);
      
//       // Request camera access with lower resolution to improve performance
//       const constraints = {
//         video: { 
//           facingMode: 'environment',
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         }
//       };
      
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
        
//         // Wait for metadata to be loaded before playing
//         videoRef.current.onloadedmetadata = async () => {
//           try {
//             await videoRef.current.play();
//             requestAnimationFrame(scanFrame);
//           } catch (playError) {
//             console.error('Error playing video stream:', playError);
//             setError('Could not start video stream. Please check camera permissions.');
//             setScanning(false);
            
//             if (stream) {
//               stream.getTracks().forEach(track => track.stop());
//             }
//           }
//         };
//       }
//     } catch (err) {
//       console.error('Error accessing camera:', err);
//       if (err.name === 'NotAllowedError') {
//         setError('Camera access denied. Please allow camera permissions and refresh.');
//       } else if (err.name === 'NotFoundError') {
//         setError('No camera found. Please connect a camera and try again.');
//       } else {
//         setError(`Camera error: ${err.message}`);
//       }
//       setScanning(false);
//     }
//   };
  
//   const stopScanner = () => {
//     setScanning(false);
    
//     // Stop video tracks
//     if (videoRef.current && videoRef.current.srcObject) {
//       const tracks = videoRef.current.srcObject.getTracks();
//       tracks.forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//   };
  
//   const scanFrame = () => {
//     if (!scanning || !videoRef.current || !canvasRef.current || !window.jsQR) {
//       return;
//     }
    
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
    
//     // Only process if video is playing and has dimensions
//     if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
//       const context = canvas.getContext('2d', { willReadFrequently: true });
      
//       // Set canvas dimensions to match video
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
      
//       // Draw video frame on canvas
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
//       try {
//         // Get image data from canvas
//         const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
//         // Process with jsQR
//         const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
//           inversionAttempts: 'dontInvert',
//         });
        
//         if (code && !scanned) {
//           console.log("Scanned barcode:", code.data);
//           setScanned(true);
          
//           // Call parent handler with barcode data
//           onScan(code.data);
          
//           // Re-enable scanning after delay
//           setTimeout(() => {
//             setScanned(false);
//           }, 2000);
//         }
//       } catch (err) {
//         console.error('Error processing barcode:', err);
//       }
//     }
    
//     // Continue scanning
//     if (scanning) {
//       requestAnimationFrame(scanFrame);
//     }
//   };
  
//   return (
//     <div className="qr-scanner-container">
//       <div className="scanner-status">
//         {!jsQRLoaded ? 'Loading scanner...' : scanning ? 'Camera active' : 'Camera inactive'}
//       </div>
      
//       <div className="video-container">
//         {/* Make sure video is visible and properly sized */}
//         <video 
//           ref={videoRef} 
//           className="scanner-video" 
//           playsInline 
//           muted 
//           style={{ display: 'block', width: '100%', height: 'auto' }}
//         />
        
//         {/* The canvas should be positioned over the video */}
//         <canvas 
//           ref={canvasRef} 
//           className="scanner-canvas" 
//           style={{ 
//             position: 'absolute', 
//             top: 0, 
//             left: 0, 
//             width: '100%', 
//             height: '100%',
//             display: 'none' // Hide canvas but still use it for processing
//           }} 
//         />
        
//         {scanning && (
//           <div className="scanning-overlay" style={{ 
//             position: 'absolute', 
//             top: 0, 
//             left: 0, 
//             right: 0, 
//             bottom: 0,
//             pointerEvents: 'none' 
//           }}>
//             <div className="scan-area"></div>
//             <div className="scan-line"></div>
//           </div>
//         )}
//       </div>
      
//       <div className="scanner-controls">
//         {error && <p className="scanner-error">{error}</p>}
        
//         <button 
//           onClick={scanning ? stopScanner : startScanner} 
//           className={`scan-button ${scanning ? 'stop' : 'start'}`}
//         >
//           {scanning ? 'Stop Camera' : 'Start Camera'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QrScanner;


// import React, { useState, useEffect } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import './QrScanner.css';

// const QrScanner = ({ onScan }) => {
//   const [scanning, setScanning] = useState(false);
//   const [error, setError] = useState(null);
//   const [scanner, setScanner] = useState(null);
//   const qrBoxSize = 250;
//   const containerId = "html5qr-code-full-region";

//   useEffect(() => {
//     // Clean up on unmount
//     return () => {
//       stopScanner();
//     };
//   }, []);

//   const startScanner = async () => {
//     if (scanning) return; // Prevent multiple starts
    
//     try {
//       setError(null);
      
//       const html5QrCode = new Html5Qrcode(containerId);
//       setScanner(html5QrCode);
      
//       const config = {
//         fps: 10,
//         qrbox: { width: qrBoxSize, height: qrBoxSize },
//         aspectRatio: 1.0,
//         formatsToSupport: [
//           Html5Qrcode.FORMATS.QR_CODE,
//           Html5Qrcode.FORMATS.EAN_13,
//           Html5Qrcode.FORMATS.CODE_39,
//           Html5Qrcode.FORMATS.CODE_93,
//           Html5Qrcode.FORMATS.CODE_128,
//           Html5Qrcode.FORMATS.UPC_A,
//           Html5Qrcode.FORMATS.UPC_E,
//           Html5Qrcode.FORMATS.EAN_8,
//           Html5Qrcode.FORMATS.ITF
//         ],
//         experimentalFeatures: {
//           useBarCodeDetectorIfSupported: true
//         },
//         rememberLastUsedCamera: true
//       };
      
//       await html5QrCode.start(
//         { facingMode: "environment" },
//         config,
//         (decodedText, decodedResult) => {
//           // Success callback
//           console.log("Scanned code:", decodedText, decodedResult);
//           onScan(decodedText);
          
//           // Optionally pause scanning after successful scan to prevent multiple rapid scans
//           html5QrCode.pause();
//           setTimeout(() => {
//             if (html5QrCode && scanning) {
//               html5QrCode.resume();
//             }
//           }, 2000);
//         },
//         (errorMessage) => {
//           // Error callback - suppress regular scanning errors
//           if (errorMessage.includes("NotFoundException")) {
//             // These are normal during scanning - don't display to user
//             return;
//           }
//           console.log(errorMessage);
//         }
//       );
      
//       setScanning(true);
//     } catch (err) {
//       console.error('Error starting scanner:', err);
//       if (err.name === "NotAllowedError") {
//         setError('Camera access denied. Please grant permission and try again.');
//       } else if (err.name === "NotFoundError") {
//         setError('No camera found. Please connect a camera and try again.');
//       } else {
//         setError(`Camera error: ${err.message || 'Unknown error'}`);
//       }
//     }
//   };
  
//   const stopScanner = () => {
//     if (scanner && scanning) {
//       scanner.stop().then(() => {
//         console.log('Scanner stopped');
//       }).catch(err => {
//         console.error('Failed to stop scanner:', err);
//       });
//       setScanning(false);
//       setScanner(null);
//     }
//   };

//   const toggleFlashlight = async () => {
//     if (scanner && scanning) {
//       try {
//         // Get current torch status
//         const torchStatus = await scanner.getTorchState();
        
//         // Toggle torch
//         if (torchStatus) {
//           await scanner.turnOffTorch();
//         } else {
//           await scanner.turnOnTorch();
//         }
//       } catch (err) {
//         console.error('Error toggling flashlight:', err);
//         setError('Flashlight not available on this device');
//         setTimeout(() => setError(null), 3000);
//       }
//     }
//   };

//   const handleCameraSelection = async () => {
//     if (scanner) {
//       try {
//         await scanner.stop();
        
//         // Get available cameras
//         const devices = await Html5Qrcode.getCameras();
//         if (devices && devices.length) {
//           // For simplicity, just toggle between first and second camera if available
//           // In a real app, you might want to show a dropdown with all cameras
//           const cameraId = devices.length > 1 ? devices[1].id : devices[0].id;
          
//           const config = {
//             fps: 10,
//             qrbox: { width: qrBoxSize, height: qrBoxSize },
//             aspectRatio: 1.0,
//             formatsToSupport: [
//               Html5Qrcode.FORMATS.QR_CODE,
//               Html5Qrcode.FORMATS.EAN_13,
//               Html5Qrcode.FORMATS.CODE_39,
//               Html5Qrcode.FORMATS.CODE_93,
//               Html5Qrcode.FORMATS.CODE_128,
//               Html5Qrcode.FORMATS.UPC_A,
//               Html5Qrcode.FORMATS.UPC_E,
//               Html5Qrcode.FORMATS.EAN_8,
//               Html5Qrcode.FORMATS.ITF
//             ]
//           };
          
//           await scanner.start(
//             { deviceId: cameraId },
//             config,
//             (decodedText) => {
//               console.log("Scanned code:", decodedText);
//               onScan(decodedText);
              
//               // Pause scanning after successful scan
//               scanner.pause();
//               setTimeout(() => {
//                 if (scanner && scanning) {
//                   scanner.resume();
//                 }
//               }, 2000);
//             },
//             (errorMessage) => {
//               // Suppress common scanning errors
//               if (errorMessage.includes("NotFoundException")) {
//                 return;
//               }
//               console.log(errorMessage);
//             }
//           );
//         } else {
//           setError('No cameras found');
//           setScanning(false);
//         }
//       } catch (err) {
//         console.error('Error switching camera:', err);
//         setError(`Failed to switch camera: ${err.message}`);
//         // Try to restart the scanner with default settings
//         startScanner();
//       }
//     }
//   };

//   return (
//     <div className="qr-scanner-container">
//       <div className="scanner-status">
//         {scanning ? 'Camera active - Position barcode in the green box' : 'Camera inactive'}
//       </div>
      
//       <div className="video-container">
//         {/* The scanner will be rendered in this div */}
//         <div 
//           id={containerId} 
//           style={{ 
//             width: '100%', 
//             minHeight: '350px',
//             position: 'relative' 
//           }}
//         />
        
//         {scanning && (
//           <div className="scanning-overlay" style={{ 
//             position: 'absolute', 
//             top: 0, 
//             left: 0, 
//             right: 0, 
//             bottom: 0,
//             pointerEvents: 'none',
//             zIndex: 10
//           }}>
//             <div className="scan-area"></div>
//             <div className="scan-line"></div>
//           </div>
//         )}
//       </div>
      
//       <div className="scanner-controls">
//         {error && <p className="scanner-error">{error}</p>}
        
//         <div className="button-group">
//           <button 
//             onClick={scanning ? stopScanner : startScanner} 
//             className={`scan-button ${scanning ? 'stop' : 'start'}`}
//           >
//             {scanning ? 'Stop Camera' : 'Start Camera'}
//           </button>
          
//           {scanning && (
//             <>
//               <button onClick={toggleFlashlight} className="action-button flash">
//                 Toggle Flashlight
//               </button>
              
//               <button onClick={handleCameraSelection} className="action-button switch">
//                 Switch Camera
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QrScanner;

import React, { useState, useEffect, useRef } from 'react';
import './QrScanner.css';

const QrScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const scannerRef = useRef(null);
  const qrBoxSize = 250;
  const containerId = "html5qr-code-full-region";

  // Function to safely load the Html5Qrcode library
  const loadHtml5QrCode = async () => {
    try {
      // Check if Html5Qrcode is already loaded
      if (window.Html5Qrcode) {
        return window.Html5Qrcode;
      }

      // Load the library dynamically
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
        script.async = true;
        script.onload = () => {
          console.log('Html5Qrcode library loaded successfully');
          if (window.Html5Qrcode) {
            resolve(window.Html5Qrcode);
          } else {
            reject(new Error('Html5Qrcode not available after loading'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load Html5Qrcode library'));
        };
        document.body.appendChild(script);
      });
    } catch (err) {
      console.error('Error loading Html5Qrcode library:', err);
      throw err;
    }
  };

  useEffect(() => {
    // Initialize the library on component mount
    loadHtml5QrCode()
      .then(() => {
        console.log('Html5Qrcode library ready');
        setScannerInitialized(true);
      })
      .catch(err => {
        console.error('Failed to initialize scanner library:', err);
        setError('Failed to initialize scanner. Please refresh and try again.');
      });

    // Check if camera permission is already denied by getting the permission status
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' })
        .then(permissionStatus => {
          if (permissionStatus.state === 'denied') {
            setPermissionDenied(true);
            setError('Camera access is denied. Please allow camera access in your browser settings.');
          }
          
          // Listen for changes to permission
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              setPermissionDenied(false);
              setError(null);
            } else if (permissionStatus.state === 'denied') {
              setPermissionDenied(true);
              setError('Camera access is denied. Please allow camera access in your browser settings.');
              stopScannerSafely();
            }
          };
        })
        .catch(err => {
          console.log('Unable to query permission status:', err);
        });
    }

    // Clean up on unmount
    return () => {
      stopScannerSafely();
    };
  }, []);

  const stopScannerSafely = () => {
    const currentScanner = scannerRef.current;
    if (currentScanner) {
      try {
        // First check if the scanner is actually running
        if (currentScanner.getState && 
            (currentScanner.getState() === Html5QrcodeScannerState.SCANNING || 
             currentScanner.getState() === Html5QrcodeScannerState.PAUSED)) {
          currentScanner.stop().catch(err => {
            console.error('Error stopping scanner during cleanup:', err);
          });
        }
      } catch (err) {
        console.error('Error checking scanner state or stopping:', err);
      } finally {
        scannerRef.current = null;
        setScanning(false);
      }
    }
  };

  const startScanner = async () => {
    if (scanning || permissionDenied) {
      return;
    }

    try {
      setError(null);
      
      // Double check that the container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('Scanner container not found');
        setError('Scanner initialization failed. Please refresh and try again.');
        return;
      }

      // Make sure Html5Qrcode is available
      if (!window.Html5Qrcode) {
        console.error('Html5Qrcode library not loaded');
        const Html5Qrcode = await loadHtml5QrCode();
        if (!Html5Qrcode) {
          setError('QR scanner library failed to load. Please refresh and try again.');
          return;
        }
      }

      console.log('Creating new Html5Qrcode instance');
      const html5QrCode = new window.Html5Qrcode(containerId);
      
      if (!html5QrCode) {
        throw new Error('Failed to create QR scanner instance');
      }
      
      scannerRef.current = html5QrCode;
      
      console.log('Requesting camera access...');
      
      const config = {
        fps: 10,
        qrbox: { width: qrBoxSize, height: qrBoxSize },
        aspectRatio: 1.0
      };
      
      console.log('Starting QR scanner with config:', config);
      
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          const barcodeAsString = String(decodedText).trim();
          console.log("Scanned code (forced string):", barcodeAsString);
          onScan(barcodeAsString);
        },
        (errorMessage) => {
          // Suppress normal scanning errors
          if (errorMessage.includes("NotFoundException")) {
            return;
          }
          console.log('Scanning error (non-critical):', errorMessage);
        }
      );
      
      console.log('Scanner started successfully');
      setScanning(true);
      setPermissionDenied(false);
    } catch (err) {
      console.error('Error starting scanner:', err);
      
      // Properly handle permission errors
      if (err.name === "NotAllowedError" || (err.message && err.message.includes("Permission denied"))) {
        setPermissionDenied(true);
        setError('Camera access denied. Please grant camera permission in your browser settings, then refresh this page.');
      } else if (err.name === "NotFoundError") {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === "NotSupportedError") {
        setError('Your browser does not support camera access. Please try a different browser.');
      } else {
        setError(`Camera error: ${err.message || 'Unknown error'}`);
      }
      
      // Don't try to call stop() if we failed to start - this is what's causing the error
      if (scannerRef.current) {
        scannerRef.current = null;
      }
      
      setScanning(false);
    }
  };
  
  const stopScanner = () => {
    const currentScanner = scannerRef.current;
    console.log('Attempting to stop scanner');
    
    if (!currentScanner) {
      console.log('No scanner instance to stop');
      setScanning(false);
      return;
    }
    
    try {
      currentScanner.stop().then(() => {
        console.log('Scanner stopped successfully');
        scannerRef.current = null;
        setScanning(false);
      }).catch(err => {
        console.error('Failed to stop scanner:', err);
        // Force scanning state to false even if stop fails
        scannerRef.current = null;
        setScanning(false);
      });
    } catch (err) {
      console.error('Exception when stopping scanner:', err);
      // Force cleanup
      scannerRef.current = null;
      setScanning(false);
    }
  };

  // Function to request camera permission explicitly
  const requestCameraPermission = async () => {
    try {
      // Try to get user media to trigger the permission prompt
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // If we get here, permission was granted
      setPermissionDenied(false);
      setError(null);
      
      // Stop the stream we just opened
      stream.getTracks().forEach(track => track.stop());
      
      // Now we can try starting the scanner
      startScanner();
    } catch (err) {
      console.error('Failed to get camera permission:', err);
      setPermissionDenied(true);
      setError('Camera permission denied. Please check your browser settings.');
    }
  };

  return (
    <div className="qr-scanner-container">
      <div className="scanner-status">
        {!scannerInitialized ? 'Initializing scanner...' : 
         permissionDenied ? 'Camera permission denied' :
         scanning ? 'Camera active - Position barcode in the square' : 'Camera inactive'}
      </div>
      
      <div className="video-container">
        {/* The scanner will be rendered in this div */}
        <div 
          id={containerId} 
          style={{ 
            width: '100%', 
            minHeight: '350px',
            position: 'relative' 
          }}
        />
        
        {scanning && (
          <div className="scanning-overlay" style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <div className="scan-area"></div>
            <div className="scan-line"></div>
          </div>
        )}
      </div>
      
      <div className="scanner-controls">
        {error && (
          <p className="scanner-error">
            {error}
          </p>
        )}
        
        <div className="button-group">
          {permissionDenied ? (
            <button 
              onClick={requestCameraPermission}
              className="scan-button permission"
            >
              Grant Camera Permission
            </button>
          ) : (
            <button 
              onClick={scanning ? stopScanner : startScanner}
              disabled={!scannerInitialized}
              className={`scan-button ${scanning ? 'stop' : 'start'}`}
            >
              {scanning ? 'Stop Camera' : 'Start Camera'}
            </button>
          )}
        </div>
      </div>
      
      {permissionDenied && (
        <div className="permission-instructions">
          <h4>How to enable camera access:</h4>
          <ol>
            <li>Click on the camera/lock icon in your browser's address bar</li>
            <li>Select "Allow" for camera access</li>
            <li>Refresh this page after changing permissions</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default QrScanner;