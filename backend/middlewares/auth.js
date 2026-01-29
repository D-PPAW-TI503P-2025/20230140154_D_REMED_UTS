const checkRole = (role) => {
  return (req, res, next) => {

    console.log("==== DEBUG ROLE ====");
    console.log("SEMUA HEADER:", req.headers);
    console.log("ROLE DIBACA:", req.headers['x-user-role']);
    console.log("ROLE DIBUTUHKAN:", role);

    const userRole = req.headers['x-user-role'];

    if (userRole === role) {
      next();
    } else {
      res.status(403).json({
        message: `Akses ditolak! Fitur ini hanya untuk ${role}`
      });
    }
  };
};

module.exports = { checkRole };
