module.exports = {
  entry: './src/sw/firebase-messaging-sw.ts',
  module: {
    // Use `ts-loader` on any file that ends in '.ts'
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: "sw.tsconfig.json"
        }
      },
    ],
  },
  // Bundle '.ts' files as well as '.js' files.
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'firebase-messaging-sw.js',
    path: `${process.cwd()}/public/`,
  }
};