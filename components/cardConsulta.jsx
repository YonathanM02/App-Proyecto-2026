import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../hooks/useTheme';
import Etiqueta from './etiqueta';

export default function CardConsulta({
  titulo,
  subtitulo,
  icono,
  etiqueta,
  tipoEtiqueta = 'verde',
  datos = [],
  acciones = [],
  children,
  abiertoInicial = false,
  alerta = false,
}) {
  const { colores } = useTheme();
  const [expandido, setExpandido] = useState(abiertoInicial);
  const tieneDetalles = Boolean(children);

  return (
    <View
      style={[
        estilos.tarjeta,
        {
          backgroundColor: colores.tarjeta,
          borderColor: alerta ? colores.advertencia : colores.bordePrimario,
        },
      ]}
    >
      <Pressable
        onPress={tieneDetalles ? () => setExpandido((prev) => !prev) : undefined}
        style={estilos.cabecera}
      >
        <View style={estilos.filaSuperior}>
          <View style={estilos.principal}>
            {icono ? (
              <View
                style={[
                  estilos.circuloAvatar,
                  {
                    backgroundColor: alerta
                      ? colores.advertenciaBg
                      : colores.fondoTranslucido,
                  },
                ]}
              >
                {icono}
              </View>
            ) : null}

            <View style={estilos.bloqueTitulo}>
              <Text
                style={[estilos.titulo, { color: colores.textoPrincipal }]}
                numberOfLines={2}
              >
                {titulo}
              </Text>
              {subtitulo ? (
                <Text
                  style={[estilos.subtitulo, { color: colores.textoClaro }]}
                  numberOfLines={1}
                >
                  {subtitulo}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={estilos.controlesDer}>
            {etiqueta ? <Etiqueta texto={etiqueta} tipo={tipoEtiqueta} /> : null}
            {tieneDetalles ? (
              <View style={estilos.flecha}>
                {expandido ? (
                  <ChevronUpIcon color={colores.primario} size={20} />
                ) : (
                  <ChevronDownIcon color={colores.primario} size={20} />
                )}
              </View>
            ) : null}
          </View>
        </View>

        {datos.length > 0 ? (
          <View style={[estilos.grillaDatos, { borderTopColor: colores.bordeForm }]}>
            {datos.map((d, idx) => (
              <View key={idx} style={estilos.itemDato}>
                <Text style={[estilos.datoEtiqueta, { color: colores.textoClaro }]}>
                  {d.etiqueta}
                </Text>
                <Text
                  style={[
                    estilos.datoValor,
                    {
                      color: d.resaltado
                        ? colores.primario
                        : d.advertencia
                        ? colores.advertencia
                        : colores.textoPrincipal,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {d.valor}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {acciones.length > 0 ? (
          <View style={estilos.filaAcciones}>
            {acciones.map((act, idx) => (
              <Pressable
                key={idx}
                onPress={(e) => {
                  e.stopPropagation?.();
                  act.onPress?.();
                }}
                style={({ pressed }) => [
                  estilos.btnAccion,
                  {
                    backgroundColor: act.color || colores.primario,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                {act.icono}
                {act.texto ? <Text style={estilos.textoAccion}>{act.texto}</Text> : null}
              </Pressable>
            ))}
          </View>
        ) : null}
      </Pressable>

      {tieneDetalles && expandido ? (
        <View
          style={[
            estilos.panelDetalle,
            {
              backgroundColor: colores.fondoPrincipal,
              borderTopColor: colores.bordePrimario,
            },
          ]}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1.2,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cabecera: {
    padding: 14,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  principal: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  circuloAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloqueTitulo: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '800',
  },
  subtitulo: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  controlesDer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flecha: {
    marginLeft: 2,
  },
  grillaDatos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  itemDato: {
    minWidth: '28%',
    flexGrow: 1,
  },
  datoEtiqueta: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  datoValor: {
    fontSize: 13,
    fontWeight: '700',
  },
  filaAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  btnAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  textoAccion: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  panelDetalle: {
    padding: 12,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
});
