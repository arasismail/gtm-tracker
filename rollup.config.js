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
  transform(code, id) {
    // TypeScript dosyalarında 'use client' directive'ini koru
    if (id.endsWith('.tsx') || id.endsWith('.ts')) {
      const hasUseClient = code.startsWith("'use client'") || code.startsWith('"use client"');
      if (hasUseClient) {
        // Transform aşamasında comment olarak işaretle
        return {
          code: code.replace(/^['"]use client['"];?\s*/, '/* __USE_CLIENT__ */'),
          map: null
        };
      }
    }
    return null;
  },
  renderChunk(code, chunk) {
    // Render aşamasında comment'i gerçek directive'e çevir
    if (code.includes('/* __USE_CLIENT__ */')) {
      return {
        code: `'use client';\n` + code.replace(/\/\* __USE_CLIENT__ \*\/\s*/, ''),
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
        exports: 'named'
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false
      }),
      commonjs(),
      // Önce directive'leri koru
      preserveDirectives(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        exclude: ['**/*.test.ts', '**/*.test.tsx']
      }),
      // Terser'da directive'leri korumayı sağla
      terser({
        compress: {
          directives: false, // Directive'leri silme
        },
        format: {
          preamble: "'use client';" // Her dosyanın başına ekle
        }
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
    ],
    onwarn: (warning, warn) => {
      // 'use client' directive uyarılarını sustur
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    }
  },
  // Type definitions build
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
    external: [/\.css$/]
  }
];