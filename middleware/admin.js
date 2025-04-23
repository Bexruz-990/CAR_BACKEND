const SuperadminMiddleware = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Faqat superadminlar uchun' });
    }
    next();
};

const AdminOrSuperadminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Faqat adminlar yoki superadminlar uchun' });
    }
    next();
};

module.exports = { SuperadminMiddleware, AdminOrSuperadminMiddleware };
