import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

// 'use client' directive'ini koruyacak plugin
const preserveDirectives = () => ({
  name: 'preserve-directives',
  renderChunk(code, chunk) {
    // Dosya başında 'use client' varsa koru
    const hasUseClient = code.includes("'use client'") || code.includes('"use client"');
    if (hasUseClient) {
      // Mevcut directive'i temizle ve başa ekle
      const cleanCode = code.replace(/['"]use client['"];?\s*/g, '');
      return {
        code: `'use client';\n${cleanCode}`,
        map: null
      };
    }
    return null;
  }
});

export default [
  // Main build configuration
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        banner: "'use client';"
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
        banner: "'use client';"
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false
      }),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        exclude: ['**/*.test.ts', '**/*.test.tsx']
      }),
      // Directive'leri koru
      preserveDirectives(),
      // Terser'da directive'leri korumayı sağla
      terser({
        compress: {
          directives: false, // Directive'leri silme
          keep_fnames: true  // Function isimlerini koru
        },
        mangle: false // İsimleri karıştırma (opsiyonel)
      })
    ],
    external: [
      'react', 
      'react-dom', 
      'react/jsx-runtime',
      'next/router', 
      'next/script', 
      'next/navigation', 
      'js-cookie'
    ]
  },
  // Type definitions build
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
    external: [/\.css$/]
  }
];