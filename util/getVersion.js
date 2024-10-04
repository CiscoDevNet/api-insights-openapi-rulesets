
export default function getVersion(str, exceptionList) {

    // Exclude paths fragments that are considered exceptions
    if (exceptionList) {
        for (const exception of exceptionList) {
            if (str.includes(exception)) {
                str = str.replace(exception, 'EXCEPTION');
            }
        }
    }

    // The version regex is pretty complex to address all use cases at Cisco
    // Please check this Asana issue for full context and explorations: https://app.asana.com/0/1206872740398257/1206657704786474
    //const versionRegex = /\b\/?v\d+(\.\d+)*\/?(\b|$)/;  // does not fully work, captures v6 as a version number for path: "/device/cedgecflowd/app-fwd-cflowd-v6-flows"
    const versionRegex = /(?<![-\w])\/?v\d+(\.\d+)*\/?(\b|$)/;    // does NOT capture v6 as a version number for path: "/device/cedgecflowd/app-fwd-cflowd-v6-flows"

    let version = '';
    const parts = str.match(versionRegex);
    if (parts) {
        version = parts[0];

        // The latest regexp captures /v1 in some cases, let's remove leading or trailing '/' if any
        version = version.charAt(0) === '/' ? version.slice(1) : version;
        version = version.charAt(version.length - 1) === '/' ? version.slice(0, -1) : version;
    }

    return version;
}
