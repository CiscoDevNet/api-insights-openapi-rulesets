
export default function getVersion(str) {

    //const versionRegex = /v\d+[^/]*/;
    // const versionRegex = /\b\/?v\d+(\.\d+)*\//;
    const versionRegex = /\b\/?v\d+(\.\d+)*\/?(\b|$)/;
    let version = '';
    const parts = str.match(versionRegex);

    if (parts) {
        version =  parts[0];
        version = version.charAt(0) === '/' ? version.slice(1) : version;
        version = version.charAt(version.length - 1) === '/' ? version.slice(0, -1) : version;
    }

    return version;
}
  