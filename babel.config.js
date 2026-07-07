module.exports = (api) => {
  const targetsNode = api.env('test') || api.env('node');
  api.cache.using(() => process.env.BABEL_ENV || process.env.NODE_ENV);

  return {
    presets: [
      ['@babel/preset-env', {
        targets: targetsNode ? { node: 'current' } : '> 0.25%, not dead',
        // Always emit CommonJS: webpack must bundle plain require/exports because
        // package.json declares "type": "commonjs" (needed so @babel/register can
        // transpile JSX in test files under Node 22's require(esm) auto-detection).
        modules: 'commonjs',
      }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
  };
};
