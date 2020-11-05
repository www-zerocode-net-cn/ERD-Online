export const save = (data, fileName) => {
  const pom = document.createElement('a');
  pom.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`);
  pom.setAttribute('download', fileName);

  if (document.createEvent) {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
};

export const saveByBlob = (blob, fileName) => {
  const pom = document.createElement('a');
  pom.setAttribute('href', window.URL.createObjectURL(blob));
  pom.setAttribute('download', fileName);

  if (document.createEvent) {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
};

export const saveByUrl = (url, fileName) => {
  const pom = document.createElement('a');
  pom.setAttribute('href', url);
  pom.setAttribute('download', fileName);

  if (document.createEvent) {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
};

