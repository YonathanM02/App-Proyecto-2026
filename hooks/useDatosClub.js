import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DATOS_ATLETAS,
  DATOS_POSICIONES,
  DATOS_CATALOGO,
  DATOS_INVENTARIO,
  DATOS_TORNEOS,
  CATEGORIAS_DEPORTIVAS,
  CATEGORIAS_CATALOGO,
  ESTADOS_FISICOS,
} from '../data/datosIniciales';

const CLAVE_ALMACENAMIENTO = 'cannibals_lara_datos_v1';

const estadoInicial = {
  atletas: DATOS_ATLETAS,
  posiciones: DATOS_POSICIONES,
  catalogo: DATOS_CATALOGO,
  inventario: DATOS_INVENTARIO,
  torneos: DATOS_TORNEOS,
};

const DatosClubContext = createContext(null);

export function ProveedorDatosClub({ children }) {
  const [datos, setDatos] = useState(estadoInicial);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const guardado = await AsyncStorage.getItem(CLAVE_ALMACENAMIENTO);
        if (guardado) {
          const parsed = JSON.parse(guardado);
          setDatos({
            atletas: parsed.atletas || DATOS_ATLETAS,
            posiciones: parsed.posiciones || DATOS_POSICIONES,
            catalogo: parsed.catalogo || DATOS_CATALOGO,
            inventario: parsed.inventario || DATOS_INVENTARIO,
            torneos: parsed.torneos || DATOS_TORNEOS,
          });
        }
      } catch (_err) {
        setDatos(estadoInicial);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  const guardarEnMemoria = useCallback((actualizador) => {
    setDatos((anterior) => {
      const siguiente =
        typeof actualizador === 'function' ? actualizador(anterior) : actualizador;
      AsyncStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(siguiente)).catch(() => {});
      return siguiente;
    });
  }, []);

  // --- ATLETAS ---
  const guardarAtleta = useCallback(
    (registro, idEditar = null) => {
      guardarEnMemoria((anterior) => {
        if (idEditar !== null) {
          return {
            ...anterior,
            atletas: anterior.atletas.map((a) =>
              a.id_atleta === Number(idEditar)
                ? { ...a, ...registro, id_atleta: Number(idEditar) }
                : a
            ),
          };
        }
        const nuevoId = anterior.atletas.reduce((max, a) => Math.max(max, a.id_atleta), 0) + 1;
        const hoy = new Date().toISOString().split('T')[0];
        return {
          ...anterior,
          atletas: [
            {
              ...registro,
              id_atleta: nuevoId,
              fecha_ingreso: registro.fecha_ingreso || hoy,
              estatus: 1,
              fecha_retiro: null,
              motivo_retiro: '',
            },
            ...anterior.atletas,
          ],
        };
      });
    },
    [guardarEnMemoria]
  );

  const retirarAtleta = useCallback(
    (idAtleta, motivo = 'Retiro administrativo') => {
      const hoy = new Date().toISOString().split('T')[0];
      guardarEnMemoria((anterior) => ({
        ...anterior,
        atletas: anterior.atletas.map((a) =>
          a.id_atleta === Number(idAtleta)
            ? { ...a, estatus: 2, fecha_retiro: hoy, motivo_retiro: motivo }
            : a
        ),
      }));
    },
    [guardarEnMemoria]
  );

  const reinscribirAtleta = useCallback(
    (idAtleta) => {
      const hoy = new Date().toISOString().split('T')[0];
      guardarEnMemoria((anterior) => ({
        ...anterior,
        atletas: anterior.atletas.map((a) =>
          a.id_atleta === Number(idAtleta)
            ? { ...a, estatus: 1, fecha_reingreso: hoy }
            : a
        ),
      }));
    },
    [guardarEnMemoria]
  );

  // --- POSICIONES ---
  const guardarPosicion = useCallback(
    (registro, idEditar = null) => {
      guardarEnMemoria((anterior) => {
        if (idEditar !== null) {
          return {
            ...anterior,
            posiciones: anterior.posiciones.map((p) =>
              p.codigo_posicion === Number(idEditar)
                ? { ...p, ...registro, codigo_posicion: Number(idEditar) }
                : p
            ),
          };
        }
        const nuevoId =
          anterior.posiciones.reduce((max, p) => Math.max(max, p.codigo_posicion), 0) + 1;
        return {
          ...anterior,
          posiciones: [...anterior.posiciones, { ...registro, codigo_posicion: nuevoId }],
        };
      });
    },
    [guardarEnMemoria]
  );

  const eliminarPosicion = useCallback(
    (codigoPosicion) => {
      guardarEnMemoria((anterior) => ({
        ...anterior,
        posiciones: anterior.posiciones.filter(
          (p) => p.codigo_posicion !== Number(codigoPosicion)
        ),
      }));
    },
    [guardarEnMemoria]
  );

  // --- CATÁLOGO ---
  const guardarCatalogo = useCallback(
    (registro, idEditar = null) => {
      guardarEnMemoria((anterior) => {
        if (idEditar !== null) {
          return {
            ...anterior,
            catalogo: anterior.catalogo.map((c) =>
              c.id_catalogo === Number(idEditar)
                ? { ...c, ...registro, id_catalogo: Number(idEditar) }
                : c
            ),
          };
        }
        const nuevoId =
          anterior.catalogo.reduce((max, c) => Math.max(max, c.id_catalogo), 0) + 1;
        return {
          ...anterior,
          catalogo: [{ ...registro, id_catalogo: nuevoId }, ...anterior.catalogo],
        };
      });
    },
    [guardarEnMemoria]
  );

  const eliminarCatalogo = useCallback(
    (idCatalogo) => {
      guardarEnMemoria((anterior) => ({
        ...anterior,
        catalogo: anterior.catalogo.filter((c) => c.id_catalogo !== Number(idCatalogo)),
        inventario: anterior.inventario.filter((i) => i.id_catalogo !== Number(idCatalogo)),
      }));
    },
    [guardarEnMemoria]
  );

  // --- INVENTARIO DE ARTÍCULOS ---
  const registrarLoteInventario = useCallback(
    (lotes) => {
      guardarEnMemoria((anterior) => {
        let maxId = anterior.inventario.reduce(
          (max, item) => Math.max(max, item.codigo_articulo),
          0
        );
        let maxCorrelativo = anterior.inventario.reduce((max, item) => {
          const coincidencia = String(item.codigo_club || '').match(/(\d+)$/);
          return Math.max(max, coincidencia ? parseInt(coincidencia[1], 10) : 0);
        }, 0);

        const nuevos = [];
        lotes.forEach((lote) => {
          const cantidad = Math.max(1, Math.min(50, Number(lote.cantidad) || 1));
          for (let i = 0; i < cantidad; i++) {
            maxId += 1;
            maxCorrelativo += 1;
            nuevos.push({
              codigo_articulo: maxId,
              id_catalogo: Number(lote.id_catalogo),
              id_estado: Number(lote.id_estado),
              codigo_club: `CL-${String(maxCorrelativo).padStart(4, '0')}`,
              estatus: 1,
            });
          }
        });

        return {
          ...anterior,
          inventario: [...anterior.inventario, ...nuevos],
        };
      });
    },
    [guardarEnMemoria]
  );

  const actualizarEstadoArticulo = useCallback(
    (codigoArticulo, idEstado) => {
      guardarEnMemoria((anterior) => ({
        ...anterior,
        inventario: anterior.inventario.map((item) =>
          item.codigo_articulo === Number(codigoArticulo)
            ? { ...item, id_estado: Number(idEstado) }
            : item
        ),
      }));
    },
    [guardarEnMemoria]
  );

  const cambiarEstatusArticulo = useCallback(
    (codigoArticulo, nuevoEstatus) => {
      guardarEnMemoria((anterior) => ({
        ...anterior,
        inventario: anterior.inventario.map((item) =>
          item.codigo_articulo === Number(codigoArticulo)
            ? { ...item, estatus: Number(nuevoEstatus) }
            : item
        ),
      }));
    },
    [guardarEnMemoria]
  );

  // --- TORNEOS ---
  const guardarTorneo = useCallback(
    (registro, idEditar = null) => {
      guardarEnMemoria((anterior) => {
        if (idEditar !== null) {
          return {
            ...anterior,
            torneos: anterior.torneos.map((t) =>
              t.codigo_torneo === Number(idEditar)
                ? { ...t, ...registro, codigo_torneo: Number(idEditar) }
                : t
            ),
          };
        }
        const nuevoId =
          anterior.torneos.reduce((max, t) => Math.max(max, t.codigo_torneo), 0) + 1;
        return {
          ...anterior,
          torneos: [{ ...registro, codigo_torneo: nuevoId }, ...anterior.torneos],
        };
      });
    },
    [guardarEnMemoria]
  );

  const eliminarTorneo = useCallback(
    (codigoTorneo) => {
      guardarEnMemoria((anterior) => ({
        ...anterior,
        torneos: anterior.torneos.filter((t) => t.codigo_torneo !== Number(codigoTorneo)),
      }));
    },
    [guardarEnMemoria]
  );

  const restaurarDatosPrueba = useCallback(() => {
    guardarEnMemoria(estadoInicial);
  }, [guardarEnMemoria]);

  const contexto = {
    ...datos,
    cargando,
    categoriasDeportivas: CATEGORIAS_DEPORTIVAS,
    categoriasCatalogo: CATEGORIAS_CATALOGO,
    estadosFisicos: ESTADOS_FISICOS,
    guardarAtleta,
    retirarAtleta,
    reinscribirAtleta,
    guardarPosicion,
    eliminarPosicion,
    guardarCatalogo,
    eliminarCatalogo,
    registrarLoteInventario,
    actualizarEstadoArticulo,
    cambiarEstatusArticulo,
    guardarTorneo,
    eliminarTorneo,
    restaurarDatosPrueba,
  };

  return (
    <DatosClubContext.Provider value={contexto}>{children}</DatosClubContext.Provider>
  );
}

export function useDatosClub() {
  const ctx = useContext(DatosClubContext);
  if (!ctx) {
    throw new Error('useDatosClub debe usarse dentro de ProveedorDatosClub');
  }
  return ctx;
}
