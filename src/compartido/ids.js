export function obtenerNuevoId(seed = 'bla') {
    return `${Date.now()}-${seed}`;
}
