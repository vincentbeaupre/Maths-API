class API_Maths {
  static API_URL() { 
    return "https://band-bitter-cadet.glitch.me/api/maths";
  };

  static async Get(op, x, y, n) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.API_URL(),
        type: 'GET',
        data: { op, x, y, n },
        success: (data) => resolve(data),
        error: (err) => reject(err)
      });
    });
  }
}