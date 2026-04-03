import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/UserSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [photoUrl, setPhotoUrl] = useState(user?.PhotoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [skills, setSkills] = useState(
    user?.skills ? user.skills.join(",") : ""
  );
  const [description, setDescription] = useState(user?.description || "");
  const [location, setLocation] = useState(user?.location || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching profile", error);
        }
      }
    };
    fetchProfile();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhotoUrl(user.PhotoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setSkills(user.skills ? user.skills.join(", ") : "");
      setDescription(user.description || "");
      setLocation(user.location || "");
    }
  }, [user]);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("upload_preset", "devworldimage-cloud");

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dj7i4ts8b/image/upload",
        formData
      );
      setPhotoUrl(response.data.secure_url);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          name,
          PhotoUrl: photoUrl,
          age,
          gender,
          skills: skills.split(", "),
          description,
          location,
        },
        { withCredentials: true }
      );
      dispatch(addUser(response.data?.data));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setTimeout(() => navigate("/profile"), 3000);
    } catch (error) {
      setError(error?.response?.data);
      console.error("Error updating profile:", error);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all";

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 pt-20 pb-10 bg-[#0a0e1a] text-white">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-600/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-violet-600/6 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative glass-card p-8 rounded-2xl w-full max-w-lg animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-2 text-center">Edit Profile</h2>
        <p className="text-sm text-[#64748b] text-center mb-6">Update your information</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center"
          >
            ✓ Profile updated successfully!
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Profile Picture</label>
            <label className="flex items-center justify-center w-full py-3 rounded-xl bg-white/[0.03] border border-dashed border-white/[0.12] cursor-pointer hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <span className="text-sm text-[#64748b]">📷 Click to upload image</span>
            </label>
          </div>

          {loading && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {photoUrl && !loading && (
            <div className="flex justify-center">
              <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-full border-2 border-indigo-500/30 object-cover shadow-lg" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat", backgroundSize: "16px" }}
            >
              <option value="" className="bg-[#111827]">Select</option>
              <option value="Male" className="bg-[#111827]">Male</option>
              <option value="Female" className="bg-[#111827]">Female</option>
              <option value="Other" className="bg-[#111827]">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Skills (comma-separated)</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className={inputClass} placeholder="React, Node.js, Python" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="Tell us about yourself" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="City, Country" />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 mt-2"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
