module.exports = function (config) {
  return `
[Unit]
Description=${config.name}
After=network.target

[Service]
Type=simple
StandardOutput=null
StandardError=null
UMask=0007
ExecStart=${config.deepstreamExec} ${config.deepstreamArgs}

[Install]
`
}