window.addEventListener('scroll',function(){
    var stick = this.document.getElementById('headnav');
    stick.classList.toggle('sticky',window.scrollY > 0);
})