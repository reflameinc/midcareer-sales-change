'use strict';
// Booking happens in the embedded form (#reflame-booking); the CTAs only scroll there.
// The form reads utm/fbclid from this page's URL and sends the booking event itself,
// so never push a booking event here (it would be counted twice).
window.dataLayer = window.dataLayer || [];
for (const link of document.querySelectorAll('[data-booking]')) {
  link.addEventListener('click',()=>{
    window.dataLayer.push({event:'lp_cta_click',lp:'midcareer_sales_change',section:link.dataset.position,selected_role:document.querySelector('[role=tab][aria-selected=true]')?.dataset.role});
  });
}
const tabs = Array.from(document.querySelectorAll('[role=tab]'));
function activateTab(tab,focus = false) {
  for (const item of tabs) {
    const active = item === tab;
    item.setAttribute('aria-selected',String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  }
  if(focus) tab.focus();
  window.dataLayer.push({event:'lp_role_select',lp:'midcareer_sales_change',role:tab.dataset.role});
}
for (const tab of tabs) {
  tab.addEventListener('click',()=>activateTab(tab));
  tab.addEventListener('keydown',event=>{
    const index = tabs.indexOf(tab);
    let next;
    if(event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    if(event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
    if(event.key === 'Home') next = tabs[0];
    if(event.key === 'End') next = tabs[tabs.length - 1];
    if(next){event.preventDefault();activateTab(next,true);}
  });
}

// Keep the sticky action clear of both visible reservation actions.
const stickyAction = document.querySelector('.sticky-bar');
const mainBookingAction = document.querySelector('[data-position="hero"]');
const finalBookingSection = document.getElementById('reservation');
if ('IntersectionObserver' in window) {
  const visibleBookingAreas = new Set();
  const bookingVisibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleBookingAreas.add(entry.target);
      else visibleBookingAreas.delete(entry.target);
    }
    stickyAction.hidden = visibleBookingAreas.size > 0;
  }, {threshold:0});
  bookingVisibility.observe(mainBookingAction);
  bookingVisibility.observe(finalBookingSection);
} else { stickyAction.hidden = false; }
