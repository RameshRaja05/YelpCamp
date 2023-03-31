const notify2=document.querySelector('.notify2')
function validateSize(input) {
    const fileSize = input.files[0].size / 1024 / 1024; // in MiB
    if (fileSize > 2) {
      notify2.classList.remove('d-none')
      document.querySelector('input[type="file"]').value="";
    } else {
        notify2.classList.add('d-none');
    }
  }

