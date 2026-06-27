import React, { useState } from 'react';
import authStore from '../store/userAuth.store';
import { Loader2 } from 'lucide-react';
import useChatStore from '../store/useChatStore';
import toast, { Toaster } from 'react-hot-toast';

function UserProfile( {setprofileViewer} ) {
  // Local states mapped exactly to your Mongoose userSchema
  const {user,updateUser,isUserUpdating}=authStore()
  const [profile, setProfile] = useState({
    name: user.name,
    contact: user.contact,
    about: user.about,
    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
    profilePic: user.profilePic 
  });


  const [previewPic, setPreviewPic] = useState(profile.profilePic);

  // Dynamic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;


    setProfile(prev => ({ ...prev, [name]: value }));
  };

    const [visible, setVisible] = useState(false)
  const removeProfilePic=()=>{
    setProfile(prev=>({...prev,"profilePic":""}))
    setPreviewPic(null)
    toast.custom(<p className='text-red-600 text-lg text-center bg-white p-3 rounded-xl'>Please hit submit to remove the profilePic</p>,{duration:3000})
  }

  const [inputImage,setinputImage]=useState(null);
  const handleImageChange = (e) => {
    
    const file = e.target.files[0];
    if (file) {
      setPreviewPic(URL.createObjectURL(file));
      setinputImage(file)
      // Tip: Save your file object or base64 data here if needed for upload
    }
  };


  const {getTokenForUpload,uploadOnCloudinary}=useChatStore()
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Submitting updated userSchema payload:", profile);

    const file=inputImage
    if(inputImage)
    {
        try {
      const {timestamp,signature,apiKey}=await getTokenForUpload('profilePics')
      const formData=new FormData()
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "profilePics");
      formData.append('file',file)
        
     
      const data=await uploadOnCloudinary(formData)
      console.log(data.secure_url)
      profile.profilePic=data.secure_url;
    } catch (error) {
      console.log(error?.message)
    }
    }

    try {
        await updateUser(profile)
        
    } catch (error) {
        console.log('There is someError while updating the profile')
    } finally{
        setprofileViewer(false)
    }
    //  setprofileViewer(false); 
  };

  return (
    /* Dimmed background overlay showing the previous screen behind it */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
    
      {/* Central Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#F0F0F0] rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col md:flex-row border border-white/20">
        
        {/* Close Button Top Right */}
        <button 
          onClick={()=>{setprofileViewer(false)}}
          type="button" 
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition duration-200 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>



          
        <div className="w-full md:w-[45%] bg-[#E5E5E5] p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-300/50">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-slate-800 self-start mb-8 md:absolute md:top-8 md:left-8">
            Edit Your Profile
          </h2>

          {/* Large Interactive Profile Pic Framer */}
          <div className="w-56 h-56 rounded-full bg-[#CDCDCD] shadow-inner flex items-center justify-center overflow-hidden relative group border-4 border-white/40">
            {previewPic ? (
              <img src={previewPic} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            )}
          </div>

          {/* Trigger File Input Button */}
          <label className="mt-6 px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-full border border-slate-300 shadow-sm transition duration-200 text-sm flex items-center gap-2 cursor-pointer active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Update Picture
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          <label 
          onClick={removeProfilePic}
          className="mt-6 px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-full border border-slate-300 shadow-sm transition duration-200 text-sm flex items-center gap-2 cursor-pointer active:scale-95">
            Remove Picture
            {visible && <p className='text-red-500'>Now hit submit to remove the profile pic</p>}
          </label>
          <span className="text-xs text-slate-400 mt-2 font-medium">Supported formats: JPG, PNG</span>
        </div>

  
            {/* RIGHT COLUMN: Text Field Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-[55%] p-8 md:pt-16 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Input: Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
              <input 
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your Name..."
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#ff2a7a]/20 focus:border-[#ff2a7a] outline-none transition duration-200 text-sm shadow-sm"
              />
            </div>

            {/* Input: Contact */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Contact</label>
              <input 
                type="numeric"
                name="contact"
                // inputMode="numeric"  // Opens a number-only keypad on mobile devices
                pattern="^\d{10}$"     // Regex: Ensures the input consists of exactly 10 digits
                // minLength={10}       // Blocks forms from submitting if shorter than 10 digits
                maxLength={10}
                value={profile.contact}
                onChange={handleChange}
                placeholder="Contact number ..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#ff2a7a]/20 focus:border-[#ff2a7a] outline-none transition duration-200 text-sm shadow-sm"
              />
            </div>

            {/* Input: About (Textarea for descriptions) */}
            <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-slate-700">
                About
                </label>

                <span
                className={`text-xs font-medium ${
                    60 - profile.about.length <= 10
                    ? "text-red-500"
                    : "text-slate-500"
                }`}
                >
                {60 - profile.about.length} characters left
                </span>
            </div>

            <textarea
                name="about"
                value={profile.about}
                maxLength={60}
                onChange={(e) => {
                handleChange(e);

                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder="Tell us about yourself..."
                className="w-full min-h-[90px] px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#ff2a7a]/20 focus:border-[#ff2a7a] outline-none transition-all duration-200 text-sm shadow-sm resize-none overflow-hidden"
            />
            </div>

            {/* Input: DOB (Date of Birth) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">DOB</label>
               <input
                  type="date"
                  name="dob"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-600 font-medium focus:ring-2 focus:ring-[#ff2a7a]/20 focus:border-[#ff2a7a] outline-none transition duration-200 text-sm shadow-sm cursor-pointer"
                  value={profile.dob}
                  onChange={handleChange}
                  min="1960-01-01"
                  max="2018-12-31"
                />          
            </div>

            {/* Read-only: Last Seen status tracking indication */}
            {/* <div className="pt-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Last Seen Indicator</label>
              <span className="text-sm font-semibold text-emerald-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                online
              </span>
            </div> */}
          </div>

          {/* Footer Action Interaction Bar */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
            <button 
              type="button"
              onClick={()=>{setprofileViewer(false)}}
              className="px-5 py-2.5 bg-slate-300 hover:bg-slate-400 text-slate-700 font-bold rounded-lg transition duration-200 text-sm shadow-sm active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isUserUpdating}
              className="px-6 py-2.5 bg-[#ff2a7a] hover:bg-[#e02269] text-white font-bold rounded-lg transition duration-200 text-sm shadow-md shadow-[#ff2a7a]/20 active:scale-95 flex gap-2"
            >
              {isUserUpdating && <span ><Loader2 className='animate-spin size-5'/></span> }
              Submit
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}





export default UserProfile;