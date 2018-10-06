# PathRead

Run `node examples/simplePathRead.js` to try out the functionality on its own.

PathRead is a module for Transflection servers and writes informative headers including Content-Length and Content-Type before streaming the requested file.

Being an extension of Transflect, if the file open operation throws an error, an informative error object will be written back to the client.