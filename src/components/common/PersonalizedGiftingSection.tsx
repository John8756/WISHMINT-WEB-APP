import React, { useState, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Sparkles,
  CheckCircle2,
  X,
  ShoppingBag,
  Camera,
  Scissors,
  Check,
  MessageCircle,
  Plus,
  Minus,
  ArrowRight,
} from 'lucide-react';

export const PersonalizedGiftingSection: React.FC = () => {
  const { addToCart, showToast } = useShop();

  const WHATSAPP_PHONE = '919876543210';

  // Option A State (Custom Photo Frame)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [photoFileSize, setPhotoFileSize] = useState<string>('');
  const [frameRecipient, setFrameRecipient] = useState<string>('Aria & Kabir');
  const [frameDate, setFrameDate] = useState<string>('24.10.2024');
  const [frameFinish, setFrameFinish] = useState<string>('Atelier Warm Oak');
  const [frameQuantity, setFrameQuantity] = useState<number>(1);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Option B State (Wool Art Creation)
  const [woolFilePreview, setWoolFilePreview] = useState<string | null>(null);
  const [woolFileName, setWoolFileName] = useState<string>('');
  const [woolFileSize, setWoolFileSize] = useState<string>('');
  const [woolInstructions, setWoolInstructions] = useState<string>(
    'Hand-crocheted pastel bouquet with personalized initial ribbon'
  );
  const [woolPalette, setWoolPalette] = useState<string>('Blush Pink & Milk Cream');
  const [woolQuantity, setWoolQuantity] = useState<number>(1);
  const woolInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFileName(file.name);
    setPhotoFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    showToast(`📸 Photo "${file.name}" attached! Click "Order via WhatsApp" to proceed.`);
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoPreview(null);
    setPhotoFileName('');
    setPhotoFileSize('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Handle Wool File Upload
  const handleWoolFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setWoolFileName(file.name);
    setWoolFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWoolFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setWoolFilePreview(null);
    }
    showToast(`🧶 Wool pattern "${file.name}" attached successfully!`);
  };

  const handleRemoveWoolFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWoolFilePreview(null);
    setWoolFileName('');
    setWoolFileSize('');
    if (woolInputRef.current) woolInputRef.current.value = '';
  };

  // Build Option A WhatsApp Order Flow
  const handleOrderFrameViaWhatsApp = () => {
    const unitPrice = 2499;
    const totalPrice = unitPrice * frameQuantity;
    const frameProduct =
      PRODUCTS.find((p) => p.slug === 'personalized-acoustic-photo-frame') || PRODUCTS[3];

    // Also add to cart for session persistence
    addToCart(
      frameProduct,
      frameQuantity,
      {
        'Frame Finish': frameFinish,
        'Crafting Option': 'Custom Bespoke Photo Frame',
      },
      {
        recipientName: frameRecipient,
        anniversaryDate: frameDate,
        customNote: `Frame Finish: ${frameFinish} | File: ${photoFileName || 'Standard studio frame layout'}`,
        uploadedPhoto: photoPreview || undefined,
        uploadedPhotoName: photoFileName || 'Customer-Uploaded-Photograph.jpg',
        orderType: 'custom-photo-frame',
        frameFinish,
      }
    );

    // Build pre-filled WhatsApp message
    const messageLines = [
      '🌸 *WISHMINT ATELIER — BESPOKE PHOTO FRAME ORDER* 🌸',
      '',
      `✨ *Product:* Custom Handcrafted Photo Frame`,
      `💰 *Price:* Price discussed on WhatsApp`,
      `📦 *Quantity:* ${frameQuantity}`,
      '',
      '*Personalization Details:*',
      `🖼️ *Frame Finish:* ${frameFinish}`,
      `✒️ *Recipient / Inscription:* ${frameRecipient || 'Not specified'}`,
      `📅 *Anniversary / Milestone Date:* ${frameDate || 'Not specified'}`,
      `📷 *Uploaded Photo:* ${
        photoFileName ? `${photoFileName} (${photoFileSize})` : 'Will send photo directly in this chat'
      }`,
      '',
      '💬 *Customer Note:* Hello Wishmint team! I have filled out my personalized photo frame details on your website and would like to discuss pricing, custom crafting, and delivery timeline.',
    ];

    const encodedText = encodeURIComponent(messageLines.join('\n'));
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedText}`;

    showToast('Redirecting to WhatsApp with your pre-filled details! 💬');
    window.open(whatsappUrl, '_blank');
  };

  // Build Option B WhatsApp Order Flow
  const handleOrderWoolViaWhatsApp = () => {
    const unitPrice = 2899;
    const totalPrice = unitPrice * woolQuantity;
    const woolProduct =
      PRODUCTS.find((p) => p.slug === 'handmade-pastel-crochet-bouquet') || PRODUCTS[1];

    // Also add to cart for session persistence
    addToCart(
      woolProduct,
      woolQuantity,
      {
        'Color Palette': woolPalette,
        'Commission Type': 'Custom Wool Art Creation',
      },
      {
        recipientName: 'Custom Wool Art Creation',
        customNote: `Idea/Pattern: ${woolInstructions} | Palette: ${woolPalette} | File: ${woolFileName || 'None'}`,
        uploadedFile: woolFilePreview || (woolFileName ? `file:${woolFileName}` : undefined),
        uploadedFileName: woolFileName || 'Custom-Wool-Design-Pattern.pdf',
        orderType: 'wool-art-creation',
        woolPalette,
      }
    );

    // Build pre-filled WhatsApp message
    const messageLines = [
      '🧶 *WISHMINT ATELIER — BESPOKE WOOL ART COMMISSION* 🧶',
      '',
      `✨ *Product:* Artisanal Wool & Yarn Commission`,
      `💰 *Price:* Price discussed on WhatsApp`,
      `📦 *Quantity:* ${woolQuantity}`,
      '',
      '*Commission Specifications:*',
      `🧵 *Handcrafting Instructions:* ${woolInstructions || 'Custom crochet bouquet / floral commission'}`,
      `📎 *Attached Pattern/Sketch:* ${
        woolFileName ? `${woolFileName} (${woolFileSize})` : 'Will attach reference image directly in this chat'
      }`,
      '',
      '💬 *Customer Note:* Hello Wishmint Atelier artisans! I have configured my bespoke wool art idea on your website and would love to discuss pricing and crafting details.',
    ];

    const encodedText = encodeURIComponent(messageLines.join('\n'));
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedText}`;

    showToast('Opening WhatsApp with your bespoke commission details! 🧶');
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="font-label-sm text-xs font-bold text-brand-rosegold uppercase tracking-widest block mb-1">
          Section 4 &bull; Bespoke Commissions
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-brand-dark font-normal tracking-tight">
          Personalized Gifting Options
        </h2>
        <p className="font-body-sm text-xs sm:text-sm text-brand-gray mt-1 leading-relaxed">
          Create an unforgettable heirloom. Upload your personal memories or creative references, and our master craftswomen will meticulously handcraft your piece.
        </p>
      </div>

      {/* Grid of Two Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OPTION A: CUSTOM PHOTO FRAME */}
        <div className="p-6 sm:p-7 rounded-3xl liquid-glass-card border border-brand-plum/15 shadow-xl bg-white/80 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-plum/10 text-brand-plum text-[10px] font-bold uppercase tracking-wider">
                Option A &bull; Custom Photo Frame
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E7F8ED] border border-[#25D366]/40 text-[#128C7E] font-bold text-xs tracking-tight flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                Price discussed on WhatsApp
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl text-brand-dark font-medium">
                Custom Handcrafted Photo Frame
              </h3>
              {/* Mandatory Note */}
              <p className="text-xs text-brand-plum font-serif italic mt-1.5 p-3 rounded-2xl bg-brand-cream border border-brand-plum/10 leading-relaxed">
                &ldquo;Upload your favorite photo, and we will craft a beautiful custom frame around it.&rdquo;
              </p>
            </div>

            {/* Photo Upload Zone */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-brand-dark block mb-2">
                Upload Your Photo
              </label>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                id="custom-frame-photo-input"
              />

              {photoPreview ? (
                <div className="relative w-full rounded-2xl overflow-hidden border-2 border-brand-rosegold/60 bg-brand-cream/80 p-3 shadow-inner flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-none border border-white shadow-md bg-white">
                    <img src={photoPreview} alt="Uploaded Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-brand-dark truncate block">
                      {photoFileName}
                    </span>
                    <span className="text-[10px] text-brand-gray block mt-0.5">
                      {photoFileSize} &bull; Image Ready for Framing
                    </span>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="text-xs font-semibold text-brand-plum hover:underline mt-1 cursor-pointer block"
                    >
                      Change Photo
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-full hover:bg-red-50 text-brand-gray hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full py-6 px-4 rounded-2xl border-2 border-dashed border-brand-plum/30 hover:border-brand-plum bg-brand-cream/40 hover:bg-brand-cream/80 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group/btn"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-plum/10 group-hover/btn:bg-brand-plum group-hover/btn:text-white text-brand-plum flex items-center justify-center transition-colors">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-dark block">
                      Click to Browse & Upload Photo
                    </span>
                    <span className="text-[10px] text-brand-gray">
                      PNG, JPG, or WEBP up to 15MB
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Customization Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold uppercase text-brand-gray block mb-1">
                  Recipient Names / Inscription
                </label>
                <input
                  type="text"
                  value={frameRecipient}
                  onChange={(e) => setFrameRecipient(e.target.value)}
                  placeholder="e.g. Aria & Kabir"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-plum"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-brand-gray block mb-1">
                  Anniversary / Milestone Date
                </label>
                <input
                  type="text"
                  value={frameDate}
                  onChange={(e) => setFrameDate(e.target.value)}
                  placeholder="e.g. 24.10.2024"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-plum"
                />
              </div>
            </div>

            {/* Frame Finish Selection */}
            <div>
              <label className="text-[10px] font-bold uppercase text-brand-gray block mb-1">
                Frame Finish Selection
              </label>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {['Atelier Warm Oak', 'Plum Velvet Finish', 'Gallery White'].map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setFrameFinish(finish)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                      frameFinish === finish
                        ? 'liquid-glass-plum text-white shadow-sm'
                        : 'bg-white border border-brand-plum/15 text-brand-dark hover:bg-brand-cream'
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <label className="text-[11px] font-bold uppercase text-brand-dark">
                Quantity
              </label>
              <div className="flex items-center gap-3 bg-white border border-brand-plum/20 rounded-full px-3 py-1">
                <button
                  type="button"
                  onClick={() => setFrameQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-brand-plum hover:bg-brand-cream active:scale-90 transition-all cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold text-xs text-brand-dark w-4 text-center">
                  {frameQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setFrameQuantity((q) => q + 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-brand-plum hover:bg-brand-cream active:scale-90 transition-all cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: WhatsApp Order + Add to Bag */}
          <div className="mt-6 space-y-2">
            <button
              type="button"
              onClick={handleOrderFrameViaWhatsApp}
              className="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl active:scale-98 transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span>
                Order on WhatsApp
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-[10px] text-center text-brand-gray">
              Pre-fills photo reference, frame finish, and inscription directly in chat
            </p>
          </div>
        </div>

        {/* OPTION B: WOOL ART CREATION */}
        <div className="p-6 sm:p-7 rounded-3xl liquid-glass-card border border-brand-plum/15 shadow-xl bg-white/80 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold uppercase tracking-wider">
                Option B &bull; Wool Art Creation
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E7F8ED] border border-[#25D366]/40 text-[#128C7E] font-bold text-xs tracking-tight flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                Price discussed on WhatsApp
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl text-brand-dark font-medium">
                Artisanal Wool & Yarn Commission
              </h3>
              {/* Mandatory Note */}
              <p className="text-xs text-purple-900 font-serif italic mt-1.5 p-3 rounded-2xl bg-purple-50 border border-purple-200 leading-relaxed">
                &ldquo;Upload your wool-related idea, pattern, or reference, and our artisans will handcraft it for you.&rdquo;
              </p>
            </div>

            {/* Wool File Upload Zone */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-brand-dark block mb-2">
                Upload Idea, Pattern, or Reference File
              </label>

              <input
                ref={woolInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleWoolFileSelect}
                className="hidden"
                id="custom-wool-file-input"
              />

              {woolFileName ? (
                <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-300 bg-purple-50/70 p-3 shadow-inner flex items-center gap-4">
                  {woolFilePreview ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-none border border-white shadow-md bg-white">
                      <img src={woolFilePreview} alt="Pattern Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl flex-none border border-purple-200 bg-white flex flex-col items-center justify-center text-purple-900">
                      <FileText className="w-8 h-8" />
                      <span className="text-[9px] font-bold mt-1">PDF / DOC</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-purple-950 truncate block">
                      {woolFileName}
                    </span>
                    <span className="text-[10px] text-purple-700 block mt-0.5">
                      {woolFileSize} &bull; Reference Attached for Artisans
                    </span>
                    <button
                      type="button"
                      onClick={() => woolInputRef.current?.click()}
                      className="text-xs font-semibold text-purple-900 hover:underline mt-1 cursor-pointer block"
                    >
                      Change File
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveWoolFile}
                    className="p-1.5 rounded-full hover:bg-red-50 text-brand-gray hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => woolInputRef.current?.click()}
                  className="w-full py-6 px-4 rounded-2xl border-2 border-dashed border-purple-300 hover:border-purple-600 bg-purple-50/40 hover:bg-purple-50 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group/btn"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 group-hover/btn:bg-purple-800 group-hover/btn:text-white text-purple-900 flex items-center justify-center transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-dark block">
                      Click to Upload Sketch, Pattern, or Photo
                    </span>
                    <span className="text-[10px] text-brand-gray">
                      Images or PDF reference files
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Customization Details */}
            <div>
              <label className="text-[10px] font-bold uppercase text-brand-gray block mb-1">
                Handcrafting Instructions / Ideas
              </label>
              <textarea
                rows={2}
                value={woolInstructions}
                onChange={(e) => setWoolInstructions(e.target.value)}
                placeholder="Describe your desired bouquet, animal character, or stitch details..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-plum"
              />
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <label className="text-[11px] font-bold uppercase text-brand-dark">
                Quantity
              </label>
              <div className="flex items-center gap-3 bg-white border border-brand-plum/20 rounded-full px-3 py-1">
                <button
                  type="button"
                  onClick={() => setWoolQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-brand-plum hover:bg-brand-cream active:scale-90 transition-all cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold text-xs text-brand-dark w-4 text-center">
                  {woolQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setWoolQuantity((q) => q + 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-brand-plum hover:bg-brand-cream active:scale-90 transition-all cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: WhatsApp Commission + Add to Bag */}
          <div className="mt-6 space-y-2">
            <button
              type="button"
              onClick={handleOrderWoolViaWhatsApp}
              className="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl active:scale-98 transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span>
                Commission on WhatsApp
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-[10px] text-center text-brand-gray">
              Pre-fills your yarn palette, craft instructions, and attached references directly in chat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
