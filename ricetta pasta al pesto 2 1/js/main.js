document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalTime = document.getElementById('modal-time');
  const modalDiff = document.getElementById('modal-difficulty');
  const modalServings = document.getElementById('modal-servings');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');

  function openModal(data) {
    modalTitle.textContent = data.title;
    modalTime.textContent = data.time;
    modalDiff.textContent = data.difficulty;
    modalServings.textContent = data.servings;
    modalDesc.textContent = data.description;
    modalLink.href = data.href;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal({
        title: btn.dataset.title,
        time: btn.dataset.time,
        difficulty: btn.dataset.difficulty,
        servings: btn.dataset.servings,
        description: btn.dataset.description,
        href: btn.dataset.href,
      });
    });
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const link = card.querySelector('.card-link');
      if (link) window.location.href = link.getAttribute('href');
    });
  });
});
