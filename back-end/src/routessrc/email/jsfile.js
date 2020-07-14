console.log('printed on console');

function btn() {
  console.log('ola');
  try {
    fetch('http://localhost:3000/testemail', {
      method: 'POST',
      body: {
        Professor: 1,
        AccessID: 1,
      },
    }).then(response => {
      console.log('Completed!', response);
    });
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

document.querySelector('.ola').addEventListener('click', btn);
