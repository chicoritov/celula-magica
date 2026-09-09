import { useRef, useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';

interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  zoom: number;
}

/**
 * Hook para sincronizar câmeras entre múltiplos Canvas 3D.
 * Retorna:
 * - cameraState: estado atual compartilhado
 * - registerCamera: registra um controle de câmera
 * - onCameraChange: callback para quando uma câmera muda
 */
export function useSyncedCamera() {
  const controlsRef = useRef<any[]>([]);
  const isUpdatingRef = useRef(false);
  const [cameraState, setCameraState] = useState<CameraState>({
    position: new THREE.Vector3(0, 2, 7),
    target: new THREE.Vector3(0, 0, 0),
    zoom: 1,
  });

  const registerControls = useCallback((controls: any) => {
    if (controls && !controlsRef.current.includes(controls)) {
      controlsRef.current.push(controls);
    }
    return () => {
      controlsRef.current = controlsRef.current.filter(c => c !== controls);
    };
  }, []);

  const syncCameras = useCallback((sourceControls: any) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const camera = sourceControls.object;
    const newState: CameraState = {
      position: camera.position.clone(),
      target: sourceControls.target.clone(),
      zoom: camera.zoom,
    };

    setCameraState(newState);

    // Sincroniza com todos os outros controles
    controlsRef.current.forEach(controls => {
      if (controls !== sourceControls) {
        controls.object.position.copy(newState.position);
        controls.target.copy(newState.target);
        controls.object.zoom = newState.zoom;
        controls.object.updateProjectionMatrix();
        controls.update();
      }
    });

    isUpdatingRef.current = false;
  }, []);

  // Reset quando muda de tela
  const resetCamera = useCallback(() => {
    const defaultPos = new THREE.Vector3(0, 2, 7);
    const defaultTarget = new THREE.Vector3(0, 0, 0);
    
    controlsRef.current.forEach(controls => {
      controls.object.position.copy(defaultPos);
      controls.target.copy(defaultTarget);
      controls.object.zoom = 1;
      controls.object.updateProjectionMatrix();
      controls.update();
    });

    setCameraState({
      position: defaultPos,
      target: defaultTarget,
      zoom: 1,
    });
  }, []);

  return {
    cameraState,
    registerControls,
    syncCameras,
    resetCamera,
  };
}
