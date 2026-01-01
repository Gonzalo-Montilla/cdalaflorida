import { useState, useRef, useEffect } from 'react';

interface CapturaFotosProps {
  onFotosChange: (fotos: string[]) => void;
  maxFotos?: number;
}

export default function CapturaFotos({ onFotosChange, maxFotos = 4 }: CapturaFotosProps) {
  const [fotos, setFotos] = useState<string[]>([]);
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camarasTraseras, setCamarasTraseras] = useState(true); // Para móviles
  const [errorCamara, setErrorCamara] = useState<string>('');
  const [cargandoCamara, setCargandoCamara] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpiar stream al desmontar componente
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Iniciar cámara
  const iniciarCamara = async () => {
    setErrorCamara('');
    setCargandoCamara(true);

    try {
      // Verificar soporte del navegador
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a cámara');
      }

      // Intentar con constraints simples primero (mejor compatibilidad)
      let constraints: MediaStreamConstraints = {
        video: true,
        audio: false
      };

      console.log('Solicitando acceso a cámara...');
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Cámara obtenida:', mediaStream.getVideoTracks()[0].label);
      
      setStream(mediaStream);
      setMostrarCamara(true);
      
      // Esperar a que el video element esté en el DOM
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Asignar stream al video
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        
        console.log('Stream asignado al video. VideoTracks:', mediaStream.getVideoTracks().length);
        
        // Evento cuando está listo
        video.onloadedmetadata = () => {
          console.log('Metadatos cargados. Video dimensions:', video.videoWidth, 'x', video.videoHeight);
          video.play().then(() => {
            console.log('✅ Video reproduciendo correctamente');
          }).catch(err => {
            console.error('❌ Error al reproducir:', err);
          });
        };
        
        // También intentar play inmediatamente
        setTimeout(() => {
          video.play().catch(err => console.warn('Play inmediato falló (normal):', err));
        }, 100);
      }

      setCargandoCamara(false);
    } catch (error: any) {
      console.error('Error al acceder a la cámara:', error);
      let mensajeError = 'No se pudo acceder a la cámara. ';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        mensajeError += 'Permisos denegados. Por favor, permite el acceso a la cámara.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        mensajeError += 'No se encontró ninguna cámara en tu dispositivo.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        mensajeError += 'La cámara está en uso por otra aplicación.';
      } else {
        mensajeError += error.message || 'Error desconocido.';
      }
      
      setErrorCamara(mensajeError);
      setMostrarCamara(false);
      setCargandoCamara(false);
      alert(mensajeError);
    }
  };

  // Detener cámara
  const detenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setMostrarCamara(false);
  };

  // Cambiar entre cámara frontal y trasera (solo móviles)
  const cambiarCamara = async () => {
    detenerCamara();
    setCamarasTraseras(!camarasTraseras);
    setTimeout(() => iniciarCamara(), 100);
  };

  // Capturar foto desde cámara
  const capturarFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Establecer dimensiones del canvas según el video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dibujar el frame actual del video en el canvas
        ctx.drawImage(video, 0, 0);
        
        // Convertir a base64 con compresión
        const fotoBase64 = canvas.toDataURL('image/jpeg', 0.8);
        agregarFoto(fotoBase64);
      }
    }
  };

  // Agregar foto a la lista
  const agregarFoto = (fotoBase64: string) => {
    if (fotos.length < maxFotos) {
      const nuevasFotos = [...fotos, fotoBase64];
      setFotos(nuevasFotos);
      onFotosChange(nuevasFotos);
      
      // Cerrar cámara si ya se alcanzó el máximo
      if (nuevasFotos.length >= maxFotos) {
        detenerCamara();
      }
    }
  };

  // Eliminar foto
  const eliminarFoto = (index: number) => {
    const nuevasFotos = fotos.filter((_, i) => i !== index);
    setFotos(nuevasFotos);
    onFotosChange(nuevasFotos);
  };

  // Subir foto desde archivo (celular galería o PC)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fotosRestantes = maxFotos - fotos.length;
    const archivosAProcesar = Array.from(files).slice(0, fotosRestantes);

    archivosAProcesar.forEach(file => {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          agregarFoto(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          📷 Fotos del Vehículo ({fotos.length}/{maxFotos})
        </label>
        
        <div className="flex gap-2">
          {!mostrarCamara && fotos.length < maxFotos && (
            <>
              {/* Botón Galería/Archivo - PRINCIPAL */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 flex items-center gap-2 font-semibold shadow-md"
              >
                📸 Agregar Fotos
              </button>
              
              {/* Botón Cámara Web - Experimental */}
              <button
                type="button"
                onClick={iniciarCamara}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                title="Vista previa de cámara (puede no funcionar en algunos navegadores)"
              >
                📹 Cámara Web
              </button>
            </>
          )}
          
          {mostrarCamara && (
            <>
              {/* Botón Cambiar Cámara (móviles) */}
              <button
                type="button"
                onClick={cambiarCamara}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                title="Cambiar entre cámara frontal y trasera"
              >
                🔄 Cambiar
              </button>
              
              {/* Botón Cerrar Cámara */}
              <button
                type="button"
                onClick={detenerCamara}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                ✖ Cerrar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Input oculto para subir archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment" // Sugiere cámara trasera en móviles
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Mensaje de error */}
      {errorCamara && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-semibold">⚠️ {errorCamara}</p>
        </div>
      )}

      {/* Indicador de carga */}
      {cargandoCamara && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-800 font-semibold">Iniciando cámara...</p>
          <p className="text-blue-600 text-sm mt-2">Por favor, permite el acceso cuando tu navegador lo solicite</p>
        </div>
      )}

      {/* Vista de cámara en vivo */}
      {mostrarCamara && !cargandoCamara && (
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(1)' }}
            />
            
            {/* Botón de captura flotante */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button
                type="button"
                onClick={capturarFoto}
                disabled={fotos.length >= maxFotos}
                className="w-20 h-20 bg-white rounded-full border-4 border-blue-600 hover:bg-blue-50 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                title="Tomar foto"
              >
                <span className="text-3xl">📸</span>
              </button>
            </div>

            {/* Indicador de fotos restantes */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg text-sm">
              Fotos: {fotos.length}/{maxFotos}
            </div>
          </div>
        </div>
      )}

      {/* Canvas oculto para procesamiento */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Galería de fotos capturadas */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fotos.map((foto, index) => (
            <div key={index} className="relative group">
              <img
                src={foto}
                alt={`Foto del vehículo ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors"
              />
              
              {/* Botón eliminar */}
              <button
                type="button"
                onClick={() => eliminarFoto(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center justify-center"
                title="Eliminar foto"
              >
                <span className="text-sm">✖</span>
              </button>
              
              {/* Etiqueta de número */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                Foto {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {fotos.length === 0 && !mostrarCamara && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-gray-600 font-medium mb-2">
            No hay fotos del vehículo
          </p>
          <p className="text-gray-500 text-sm">
            Haz clic en "Agregar Fotos" para subir imágenes desde tu dispositivo
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Puedes tomar fotos con la cámara de tu celular/PC y luego subirlas
          </p>
        </div>
      )}

      {/* Ayuda informativa */}
      {fotos.length > 0 && fotos.length < maxFotos && !mostrarCamara && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <span className="font-semibold">💡 Consejo:</span> Puedes agregar hasta {maxFotos - fotos.length} fotos más
        </div>
      )}
    </div>
  );
}
