
export default function getVersion(str, exceptionList) {

    // Exclude paths fragments that are considered exceptions
    if (exceptionList) {
        for (const exception of exceptionList) {
            if (str.includes(exception)) {
                str = str.replace(exception, 'EXCEPTION');
            }
        }
    }

    // The version regex is pretty complex to address most use cases at Cisco, check this asana issue for context:
    // The regexp requires to remove leading or trailing '/' if any.
    const versionRegex = /\b\/?v\d+(\.\d+)*\/?(\b|$)/;

    let version = '';
    const parts = str.match(versionRegex);
    if (parts) {
        version = parts[0];

        // Remove leading or trailing '/' 
        version = version.charAt(0) === '/' ? version.slice(1) : version;
        version = version.charAt(version.length - 1) === '/' ? version.slice(0, -1) : version;
    }

    return version;
}
