const LoanUser = require("../model/LoanUser");

// GET /api/members
const getMembers = async (req, res) => {
  try {
    const members = await LoanUser.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/members/stats
const getStats = async (req, res) => {
  try {
    const members = await LoanUser.find();
    const totalMembers = members.length;
    const totalPrincipal = members.reduce((s, m) => s + Number(m.amount || 0), 0);
    const totalPaid = members.reduce((s, m) => {
      return s + m.payments.filter(p => p.type === "payment").reduce((a, p) => a + Number(p.amount), 0);
    }, 0);
    const totalInterest = members.reduce((s, m) => {
      return s + m.payments.filter(p => p.type === "interest").reduce((a, p) => a + Number(p.amount), 0);
    }, 0);

    res.json({ totalMembers, totalPrincipal, totalPaid, totalInterest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/members
const createMember = async (req, res) => {
  try {
    const { name, amount, joinDate, notes } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ message: "Name and amount are required" });
    }
    const member = await LoanUser.create({
      name,
      amount: Number(amount),
      joinDate: joinDate || new Date().toISOString().slice(0, 10),
      notes: notes || "",
      payments: [],
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/members/:id
const updateMember = async (req, res) => {
  try {
    const { name, amount, joinDate, notes } = req.body;
    const member = await LoanUser.findByIdAndUpdate(
      req.params.id,
      { name, amount: Number(amount), joinDate, notes },
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/members/:id
const deleteMember = async (req, res) => {
  try {
    const member = await LoanUser.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json({ message: "Member deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/members/:id/payments
const addPayment = async (req, res) => {
  try {
    const { amount, date, type, notes } = req.body;
    if (!amount || !date || !type) {
      return res.status(400).json({ message: "Amount, date and type are required" });
    }
    const member = await LoanUser.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.payments.push({ amount: Number(amount), date, type, notes: notes || "" });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/members/:id/payments/:paymentId
const deletePayment = async (req, res) => {
  try {
    const member = await LoanUser.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const payment = member.payments.id(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.deleteOne();
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMembers, getStats, createMember, updateMember, deleteMember, addPayment, deletePayment };
