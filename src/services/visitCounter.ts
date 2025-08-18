export const VisitCounterService = {
  incrementVisit(pageKey: string) {
    const visits = this.getVisits(pageKey);
    localStorage.setItem(pageKey, (visits + 1).toString());
    return visits + 1;
  },

  getVisits(pageKey: string): number {
    const visits = localStorage.getItem(pageKey);
    return visits ? parseInt(visits, 10) : 0;
  },

  getTotalSiteVisits(): number {
    const totalVisitsKey = 'total_site_visits';
    const visits = localStorage.getItem(totalVisitsKey);
    return visits ? parseInt(visits, 10) : 0;
  },

  incrementTotalSiteVisits(): number {
    const totalVisitsKey = 'total_site_visits';
    const lastVisitKey = 'last_site_visit_timestamp';
    const currentTime = Date.now();
    const lastVisitTime = localStorage.getItem(lastVisitKey);

    // Only increment if more than 5 seconds have passed since last visit
    if (!lastVisitTime || (currentTime - parseInt(lastVisitTime, 10) > 5000)) {
      const currentVisits = this.getTotalSiteVisits();
      const newVisits = currentVisits + 1;
      localStorage.setItem(totalVisitsKey, newVisits.toString());
      localStorage.setItem(lastVisitKey, currentTime.toString());
      return newVisits;
    }

    return this.getTotalSiteVisits();
  }
};
