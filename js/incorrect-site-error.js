var choice = async () => {
  const {value} = await Swal.fire({
    title: 'You are not on ola cabs site. Please select an option then click the icon again.',
    input: 'radio',
    inputOptions: {
      ola: "Ola Cabs"
    }
  });
  if (value) {
    if (value === 'ola') {
      window.open("https://book.olacabs.com/", "_blank");
    }
  }
};

choice();
