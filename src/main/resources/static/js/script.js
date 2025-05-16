/** =======================
 * Config
 * ======================= */
const FILE_CONFIG = {
    "MIN_SIZE": 1024,
    "MAX_SIZE": 50 * 1024 * 1024
}

/** =======================
 * Func
 * ======================= */
function isFileSizeWithinLimit(size) {
    return 0 < size && FILE_CONFIG.MAX_SIZE > size;
}

function fileChecker() {
    const $files = this.files;

    if ($files.length > 5)
        alert("You can attach up to 5 items.")
    else {
        for (const file of $files) {
            if (!isFileSizeWithinLimit(file.size)) {
                this.value = "";
                alert("The size of each file cannot exceed 50MB." + "\n(" + (file.name) + ")");
            }
        }
    }
}

function extractContentDisposition(headers) {
    const contentDisposition = headers.get('Content-Disposition');
    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
            return decodeURI(matches[1].replace(/['"]/g, ''));
        }
    }
}

function saveAs(payload, filename) {
    let url = window.URL.createObjectURL(payload);
    let anchorElement = document.createElement('a');

    anchorElement.href = url;
    anchorElement.download = filename;
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
}

/** =======================
 * Event
 * ======================= */
function onChecked() {
    const checkAll = document.getElementById("checkAll")
    const total = document.querySelectorAll('input[name=checkInput]').length;
    const count = document.querySelectorAll('input[name=checkInput]:checked').length;
    checkAll.checked = total === count;
}

function onCheckedAll() {
    const checkAll = document.getElementById("checkAll")
    const checkboxes = document.getElementsByName("checkInput");

    for (const checkbox of checkboxes) {
        checkbox.checked = checkAll.checked;
    }
}

/** =======================
 * Fetch
 * ======================= */
const FILE_ACTION = {
    "fileList": function () {
        fetch("/api/files", {
            method: "GET",
        })
            .then(response => response.json())
            .then(result => {
                const listElement = document.getElementById("fileListBody");
                const files = result.response;

                if (files.length < 1) {
                    listElement.innerHTML = "<tr><td colspan='3' class='form-text text-center'>No files have been uploaded.</td></tr>";
                }

                files.forEach((file) => {
                    const createElement = document.createElement("tr");
                    createElement.innerHTML = `
                    <th scope="row"><input type="checkbox" id="file_${file.id}" name="checkInput" value="${file.id}" onchange="onChecked()" class="form-check-input"></th>
                    <td>
                        <label for="file_${file.id}">${file.name}</label>
                    </td>
                    <td class="list-btn text-center">
                        <button class="btn text-primary" onclick="FILE_ACTION.fileDownload('${file.id}')"><i class="bi bi-download"></i></button>
                        <button class="btn text-danger" onclick="FILE_ACTION.singleFileDelete(event,'${file.id}')"><i class="bi bi-trash3"></i></button>
                    </td>`;

                    listElement.append(createElement);
                });
            })
            .catch(error => {
                alert("Failed to load file list.");
                console.warn(error)
            })
    },
    "fileUpload": function (input) {
        const formData = new FormData();
        const files = input.files;
        for (const file of files) {
            formData.append("files", file);
        }

        fetch("/api/files/upload", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(result => {
                if (!result.success) {
                    throw new Error(result.error.message);
                }
                alert("File transfer is complete.");
                input.value = "";
            })
            .catch(error => {
                alert("File transfer failed.")
                console.warn(error)
            });
    },
    "fileDownload": function (id) {
        fetch(`/api/files/${id}`, {
            method: "GET"
        })
            .then(response => {
                const filename = extractContentDisposition(response.headers)
                if (!filename) {
                    return response.json().then(result => {
                        throw new Error(result.error.message);
                    })
                }
                return response.blob().then(blob => {
                    console.log(blob)
                    saveAs(blob, filename);
                })
            })
            .catch(error => {
                alert("File download failed.");
                console.warn(error);
            })
    },
    "singleFileDelete": function (event, id) {
        const fileListBody = document.getElementById('fileListBody');
        const deleteBtn = event.currentTarget;
        const row = deleteBtn.parentNode.parentNode;

        if (confirm("Are you sure you want to delete the file?")) {
            fetch(`/api/files/${id}`, {
                method: "DELETE"
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.success) {
                        throw new Error(result.error.message);
                    }
                    fileListBody.removeChild(row)
                    alert("The file has been deleted.");
                })
                .catch(error => {
                    alert("Failed to delete file.");
                    console.warn(error)
                })
        }
    },
    "multipleFileDelete": function (event) {
        const fileListBody = document.getElementById('fileListBody');
        const checkedInputs = document.querySelectorAll('input[name=checkInput]:checked')
        const checkedList = Array.from(checkedInputs).map(el => el.value);

        if (checkedInputs.length < 1)
            alert("Please select one or more files.")
        else {
            if (confirm("Are you sure you want to delete all selected files?")) {
                fetch(`/api/files/delete`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(checkedList),

                })
                    .then(response => response.json())
                    .then(result => {
                        if (!result.success) {
                            throw new Error(result.error.message);
                        }
                        checkedInputs.forEach((el,) => {
                            const row = el.parentNode.parentNode;
                            fileListBody.removeChild(row)
                        })
                        alert("The file has been deleted.");
                    })
                    .catch(error => {
                        alert("Failed to delete file.");
                        console.warn(error)
                    })
            }
        }
    }
}