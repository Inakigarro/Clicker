#!/usr/bin/env node

/**
 * Script de utilidad para resetear la base de datos de ZClicker
 * USO: node reset-database.js
 * 
 * Este script elimina TODOS los estados de juego de la base de datos.
 * Úsalo con cuidado solo durante early access.
 */

const readline = require('readline');

// Configuración del API
const API_URL = process.env.API_URL || 'http://localhost:3001/api/game/admin/reset-all';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚨 ADVERTENCIA: Este script eliminará TODOS los estados de juego 🚨\n');
console.log(`API URL: ${API_URL}\n`);

rl.question('¿Estás seguro de que quieres continuar? (escribe "SI" para confirmar): ', async (answer) => {
  if (answer.trim().toUpperCase() !== 'SI') {
    console.log('\n❌ Operación cancelada.');
    rl.close();
    return;
  }

  console.log('\n🔄 Reseteando base de datos...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Base de datos reseteada exitosamente!');
    console.log(`📊 Documentos eliminados: ${result.deletedCount}`);
    console.log('\n💡 Los jugadores verán sus progresos reseteados en la próxima recarga.');
    
  } catch (error) {
    console.error('\n❌ Error al resetear la base de datos:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Asegúrate de que el servidor backend está corriendo.');
    }
  } finally {
    rl.close();
  }
});
