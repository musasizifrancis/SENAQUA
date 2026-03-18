import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, StatusBar, Animated, Dimensions,
  SafeAreaView, Platform, KeyboardAvoidingView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();
const W     = Dimensions.get('window').width;

const C = {
  p:'#6B3BA0', pd:'#4e2878', pl:'#9B6BC8',
  g:'#00A651', gd:'#007d3d', gl:'#E8F5EE',
  amb:'#F4A820', red:'#e53e3e',
  bg:'#f7f5fb', t1:'#1a1025', t2:'#7a6f86', t3:'#b8b0c4',
  white:'#fff', card:'#fff', bdr:'rgba(0,0,0,0.07)',
  darkBg:'#1a0938', darkMid:'#3d1b80',
};

// ── SHARED COMPONENTS ──────────────────────────────────────
const Btn = ({ label, onPress, bg = C.p, style }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.82}
    style={[s.btn, { backgroundColor: bg }, style]}>
    <Text style={s.btnTxt}>{label}</Text>
  </TouchableOpacity>
);

const GhostBtn = ({ label, onPress, style }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[s.ghostBtn, style]}>
    <Text style={s.ghostBtnTxt}>{label}</Text>
  </TouchableOpacity>
);

const Card = ({ children, style }) => (
  <View style={[s.card, style]}>{children}</View>
);

const Row = ({ children, style }) => (
  <View style={[{ flexDirection:'row', alignItems:'center' }, style]}>{children}</View>
);

const Badge = ({ label, type='done' }) => {
  const map = { done:[C.gl,'#006b30'], pend:['#FFF8E1','#b45309'], cancel:['#FEE2E2',C.red] };
  const [bg, tc] = map[type] ?? map.done;
  return <View style={[s.badge,{backgroundColor:bg}]}><Text style={[s.badgeTxt,{color:tc}]}>{label}</Text></View>;
};

const BackHeader = ({ title, navigation }) => (
  <SafeAreaView style={{ backgroundColor:C.white }}>
    <Row style={s.topBar}>
      <TouchableOpacity style={s.tbBtn} onPress={() => navigation.goBack()}>
        <Text style={s.tbBtnTxt}>←</Text>
      </TouchableOpacity>
      <Text style={s.topTitle}>{title}</Text>
      <View style={{width:36}} />
    </Row>
  </SafeAreaView>
);

// Dark input used in auth screens
const DarkInput = ({ label, placeholder, value, onChangeText, keyboardType, secureTextEntry }) => (
  <View style={{marginBottom:14}}>
    <Text style={s.inpLbl}>{label}</Text>
    <TextInput
      style={s.darkInp}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.25)"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);

// ══════════════════════════════════════════════════════════
//  SPLASH
// ══════════════════════════════════════════════════════════
function SplashScreen({ navigation }) {
  const sc  = useRef(new Animated.Value(0.3)).current;
  const op  = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(sc, { toValue:1, tension:55, friction:6, useNativeDriver:true }).start();
    Animated.timing(op, { toValue:1, duration:500, delay:300, useNativeDriver:true }).start();
    Animated.timing(bar,{ toValue:1, duration:2000, delay:200, useNativeDriver:false })
      .start(() => setTimeout(() => navigation.replace('Login'), 200));
  }, []);

  return (
    <View style={[s.fill, { backgroundColor:C.darkBg, alignItems:'center', justifyContent:'center' }]}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg} />

      <Animated.View style={[s.splashLogo, { transform:[{scale:sc}] }]}>
        <Text style={{ fontSize:44 }}>💧</Text>
      </Animated.View>

      <Animated.View style={{ opacity:op, alignItems:'center', marginTop:16 }}>
        <Text style={s.splashTitle}>SENAQUA</Text>
        <Text style={s.splashSub}>Water & Sanitation · Maputo</Text>
      </Animated.View>

      <View style={s.barTrack}>
        <Animated.View style={[s.barFill,{
          width: bar.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] })
        }]} />
      </View>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  LOGIN
// ══════════════════════════════════════════════════════════
function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [pass,  setPass]  = useState('');

  return (
    <KeyboardAvoidingView style={[s.fill,{backgroundColor:C.darkBg}]}
      behavior={Platform.OS==='ios'?'padding':'height'}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg} />

      <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:28 }}>
        <View style={s.loginLogo}><Text style={{fontSize:30}}>💧</Text></View>
        <Text style={s.loginTitle}>SENAQUA</Text>
        <Text style={s.loginSub}>Water & Sanitation Services</Text>
        <Row style={s.livePill}>
          <View style={s.liveDot} />
          <Text style={s.liveTxt}>Service available in your area</Text>
        </Row>
      </View>

      <View style={s.loginForm}>
        <DarkInput label="PHONE NUMBER" placeholder="+258 8_ ___ ____"
          value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <DarkInput label="PASSWORD" placeholder="••••••••"
          value={pass} onChangeText={setPass} secureTextEntry />

        <TouchableOpacity style={{alignSelf:'flex-end',marginBottom:16}}>
          <Text style={s.forgotTxt}>Forgot password?</Text>
        </TouchableOpacity>

        <Btn label="Sign In →" bg={C.pl} onPress={() => navigation.replace('Main')} />

        <Row style={s.orRow}>
          <View style={s.orLine}/><Text style={s.orTxt}>or</Text><View style={s.orLine}/>
        </Row>

        <TouchableOpacity style={s.ghostDark} onPress={() => navigation.navigate('Register')}>
          <Text style={s.ghostDarkTxt}>Create an Account</Text>
        </TouchableOpacity>

        <View style={{height:10}}/>
      </View>
    </KeyboardAvoidingView>
  );
}

// ══════════════════════════════════════════════════════════
//  REGISTER — STEP 1: PERSONAL INFO
// ══════════════════════════════════════════════════════════
function RegisterScreen({ navigation }) {
  const [name,  setName]  = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView style={[s.fill,{backgroundColor:C.darkBg}]}
      behavior={Platform.OS==='ios'?'padding':'height'}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg} />

      {/* Header */}
      <SafeAreaView>
        <Row style={{paddingHorizontal:20,paddingTop:12,paddingBottom:8,justifyContent:'space-between',alignItems:'center'}}>
          <TouchableOpacity style={[s.tbBtn,{backgroundColor:'rgba(255,255,255,0.1)',borderColor:'rgba(255,255,255,0.1)'}]}
            onPress={() => navigation.goBack()}>
            <Text style={{fontSize:18,color:'#fff'}}>←</Text>
          </TouchableOpacity>
          <Text style={{fontFamily:'System',fontSize:16,fontWeight:'700',color:'#fff'}}>Create Account</Text>
          <View style={{width:36}}/>
        </Row>
      </SafeAreaView>

      {/* Step indicator */}
      <View style={{paddingHorizontal:20,marginBottom:20}}>
        <Row style={{gap:6,marginBottom:8}}>
          {[1,2,3].map(i=>(
            <View key={i} style={{flex:1,height:4,borderRadius:4,backgroundColor: i===1?C.g:'rgba(255,255,255,0.15)'}}/>
          ))}
        </Row>
        <Text style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Step 1 of 3 — Personal Info</Text>
      </View>

      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:30}}>
        <Text style={{fontSize:22,fontWeight:'800',color:'#fff',marginBottom:6}}>Who are you? 👋</Text>
        <Text style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:28}}>Tell us a bit about yourself to get started.</Text>

        <DarkInput label="FULL NAME" placeholder="e.g. Ana Machava"
          value={name} onChangeText={setName} />
        <DarkInput label="PHONE NUMBER" placeholder="+258 8_ ___ ____"
          value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <DarkInput label="EMAIL (OPTIONAL)" placeholder="you@example.com"
          value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Btn label="Continue →" bg={C.g}
          onPress={() => navigation.navigate('RegisterStep2', { name, phone, email })} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ══════════════════════════════════════════════════════════
//  REGISTER — STEP 2: ADDRESS & LOCATION
// ══════════════════════════════════════════════════════════
function RegisterStep2Screen({ navigation, route }) {
  const prev = route.params ?? {};
  const [area,    setArea]    = useState('');
  const [address, setAddress] = useState('');

  const areas = ['Maputo Central','Maputo Sul','Maputo Norte','Matola','Boane','Marracuene'];

  return (
    <KeyboardAvoidingView style={[s.fill,{backgroundColor:C.darkBg}]}
      behavior={Platform.OS==='ios'?'padding':'height'}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg} />

      <SafeAreaView>
        <Row style={{paddingHorizontal:20,paddingTop:12,paddingBottom:8,justifyContent:'space-between',alignItems:'center'}}>
          <TouchableOpacity style={[s.tbBtn,{backgroundColor:'rgba(255,255,255,0.1)',borderColor:'rgba(255,255,255,0.1)'}]}
            onPress={() => navigation.goBack()}>
            <Text style={{fontSize:18,color:'#fff'}}>←</Text>
          </TouchableOpacity>
          <Text style={{fontSize:16,fontWeight:'700',color:'#fff'}}>Create Account</Text>
          <View style={{width:36}}/>
        </Row>
      </SafeAreaView>

      <View style={{paddingHorizontal:20,marginBottom:20}}>
        <Row style={{gap:6,marginBottom:8}}>
          {[1,2,3].map(i=>(
            <View key={i} style={{flex:1,height:4,borderRadius:4,backgroundColor: i<=2?C.g:'rgba(255,255,255,0.15)'}}/>
          ))}
        </Row>
        <Text style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Step 2 of 3 — Your Location</Text>
      </View>

      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:30}}>
        <Text style={{fontSize:22,fontWeight:'800',color:'#fff',marginBottom:6}}>Where are you? 📍</Text>
        <Text style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:28}}>We use this to find drivers near you.</Text>

        <Text style={s.inpLbl}>SELECT YOUR AREA</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20}}>
          {areas.map(a=>(
            <TouchableOpacity key={a}
              style={{paddingHorizontal:14,paddingVertical:9,borderRadius:20,borderWidth:1.5,
                borderColor: area===a?C.g:'rgba(255,255,255,0.15)',
                backgroundColor: area===a?'rgba(0,166,81,0.15)':'transparent'}}
              onPress={()=>setArea(a)}>
              <Text style={{fontSize:12,fontWeight:'600',color: area===a?C.g:'rgba(255,255,255,0.55)'}}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <DarkInput label="STREET ADDRESS" placeholder="e.g. Av. Eduardo Mondlane 42"
          value={address} onChangeText={setAddress} />

        <Btn label="Continue →" bg={C.g}
          onPress={() => navigation.navigate('RegisterStep3', { ...prev, area, address })} />
        <GhostBtn label="Back" onPress={() => navigation.goBack()} style={{marginTop:10,borderColor:'rgba(255,255,255,0.15)'}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ══════════════════════════════════════════════════════════
//  REGISTER — STEP 3: PASSWORD & CONFIRM
// ══════════════════════════════════════════════════════════
function RegisterStep3Screen({ navigation, route }) {
  const prev = route.params ?? {};
  const [pass,    setPass]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed,  setAgreed]  = useState(false);
  const mismatch = pass && confirm && pass !== confirm;

  return (
    <KeyboardAvoidingView style={[s.fill,{backgroundColor:C.darkBg}]}
      behavior={Platform.OS==='ios'?'padding':'height'}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg} />

      <SafeAreaView>
        <Row style={{paddingHorizontal:20,paddingTop:12,paddingBottom:8,justifyContent:'space-between',alignItems:'center'}}>
          <TouchableOpacity style={[s.tbBtn,{backgroundColor:'rgba(255,255,255,0.1)',borderColor:'rgba(255,255,255,0.1)'}]}
            onPress={() => navigation.goBack()}>
            <Text style={{fontSize:18,color:'#fff'}}>←</Text>
          </TouchableOpacity>
          <Text style={{fontSize:16,fontWeight:'700',color:'#fff'}}>Create Account</Text>
          <View style={{width:36}}/>
        </Row>
      </SafeAreaView>

      <View style={{paddingHorizontal:20,marginBottom:20}}>
        <Row style={{gap:6,marginBottom:8}}>
          {[1,2,3].map(i=>(
            <View key={i} style={{flex:1,height:4,borderRadius:4,backgroundColor:C.g}}/>
          ))}
        </Row>
        <Text style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Step 3 of 3 — Set Your Password</Text>
      </View>

      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:30}}>
        <Text style={{fontSize:22,fontWeight:'800',color:'#fff',marginBottom:6}}>Almost done! 🔐</Text>
        <Text style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:28}}>Create a secure password for your account.</Text>

        {/* Summary card */}
        <View style={{backgroundColor:'rgba(255,255,255,0.06)',borderRadius:14,padding:14,borderWidth:1,borderColor:'rgba(255,255,255,0.1)',marginBottom:22}}>
          <Row style={{gap:10,marginBottom:8}}>
            <View style={{width:38,height:38,borderRadius:12,backgroundColor:'rgba(107,59,160,0.5)',alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:18}}>👤</Text>
            </View>
            <View>
              <Text style={{fontSize:14,fontWeight:'700',color:'#fff'}}>{prev.name || 'New User'}</Text>
              <Text style={{fontSize:12,color:'rgba(255,255,255,0.45)'}}>{prev.phone || ''}</Text>
            </View>
          </Row>
          {prev.area ? (
            <Row style={{gap:6}}>
              <Text style={{fontSize:12}}>📍</Text>
              <Text style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{prev.area}{prev.address?` · ${prev.address}`:''}</Text>
            </Row>
          ) : null}
        </View>

        <DarkInput label="PASSWORD" placeholder="Min. 8 characters"
          value={pass} onChangeText={setPass} secureTextEntry />
        <DarkInput label="CONFIRM PASSWORD" placeholder="Repeat your password"
          value={confirm} onChangeText={setConfirm} secureTextEntry />

        {mismatch && (
          <Text style={{color:'#ff6b6b',fontSize:12,marginTop:-8,marginBottom:12}}>⚠ Passwords do not match</Text>
        )}

        {/* Terms */}
        <TouchableOpacity onPress={()=>setAgreed(!agreed)}
          style={{flexDirection:'row',alignItems:'flex-start',gap:10,marginBottom:22}}>
          <View style={{width:20,height:20,borderRadius:6,borderWidth:1.5,
            borderColor: agreed?C.g:'rgba(255,255,255,0.25)',
            backgroundColor: agreed?C.g:'transparent',
            alignItems:'center',justifyContent:'center',marginTop:1}}>
            {agreed && <Text style={{color:'#fff',fontSize:11,fontWeight:'800'}}>✓</Text>}
          </View>
          <Text style={{flex:1,fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:18}}>
            I agree to SENAQUA's <Text style={{color:C.pl}}>Terms of Service</Text> and <Text style={{color:C.pl}}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <Btn label="Create My Account ✓" bg={(!agreed||mismatch||!pass)?'rgba(255,255,255,0.15)':C.g}
          onPress={() => {
            if (!agreed || mismatch || !pass) return;
            navigation.navigate('RegisterSuccess');
          }} />
        <GhostBtn label="Back" onPress={() => navigation.goBack()} style={{marginTop:10,borderColor:'rgba(255,255,255,0.15)'}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ══════════════════════════════════════════════════════════
//  REGISTER SUCCESS
// ══════════════════════════════════════════════════════════
function RegisterSuccessScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale,{toValue:1,tension:50,friction:5,useNativeDriver:true}),
      Animated.timing(fade,{toValue:1,duration:400,useNativeDriver:true}),
    ]).start();
  }, []);

  return (
    <View style={[s.fill,{backgroundColor:C.darkBg,alignItems:'center',justifyContent:'center',padding:28}]}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg} />

      <Animated.Text style={{fontSize:80,transform:[{scale}]}}>🎉</Animated.Text>

      <Animated.View style={{opacity:fade,alignItems:'center',marginTop:20}}>
        <Text style={{fontSize:26,fontWeight:'800',color:'#fff',letterSpacing:-0.5,marginBottom:8,textAlign:'center'}}>
          Welcome to{'\n'}SENAQUA!
        </Text>
        <Text style={{fontSize:14,color:'rgba(255,255,255,0.5)',textAlign:'center',lineHeight:22,marginBottom:40}}>
          Your account has been created.{'\n'}Clean water is just a tap away. 💧
        </Text>

        <View style={{backgroundColor:'rgba(0,166,81,0.12)',borderRadius:16,padding:16,borderWidth:1,borderColor:'rgba(0,166,81,0.25)',width:'100%',marginBottom:32}}>
          {[
            {ico:'💧',txt:'Order water delivery anytime'},
            {ico:'🪣',txt:'Book septic emptying services'},
            {ico:'📍',txt:'Track your driver in real time'},
            {ico:'👛',txt:'Pay easily via M-Pesa or bank'},
          ].map(f=>(
            <Row key={f.txt} style={{gap:12,marginBottom:10}}>
              <Text style={{fontSize:18}}>{f.ico}</Text>
              <Text style={{fontSize:13,color:'rgba(255,255,255,0.65)',flex:1}}>{f.txt}</Text>
            </Row>
          ))}
        </View>

        <Btn label="Get Started →" bg={C.g} style={{width:'100%'}}
          onPress={() => navigation.replace('Main')} />
      </Animated.View>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  HOME
// ══════════════════════════════════════════════════════════
function HomeScreen({ navigation }) {
  const recent = [
    { id:'1', type:'water',  name:'Water Delivery',  meta:'10,000L · Mar 12 · Manuel C.', amount:'280 MZN', status:'done' },
    { id:'2', type:'sludge', name:'Septic Emptying',  meta:'Full tank · Mar 8 · João S.',   amount:'500 MZN', status:'done' },
    { id:'3', type:'water',  name:'Water Delivery',  meta:'5,000L · Mar 3 · Carlos M.',    amount:'150 MZN', status:'pend' },
  ];
  return (
    <View style={[s.fill, { backgroundColor:C.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg} />
      <View style={[s.homeHdr, { backgroundColor:C.darkMid }]}>
        <SafeAreaView>
          <Row style={{ justifyContent:'space-between', marginBottom:18 }}>
            <View>
              <Text style={s.greet}>Good morning 👋</Text>
              <Text style={s.userName}>Ana Machava</Text>
            </View>
            <TouchableOpacity style={s.avatar} onPress={() => navigation.navigate('Profile')}>
              <Text style={{fontSize:22}}>👩🏾</Text>
            </TouchableOpacity>
          </Row>
          <Text style={s.balLbl}>WALLET BALANCE</Text>
          <Text style={s.balAmt}>MZN 1,450.00</Text>
          <Text style={s.balSub}><Text style={{color:'#4ade80'}}>▲ 280 MZN</Text>  added this month</Text>
        </SafeAreaView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Row style={{ paddingHorizontal:18, paddingTop:16, gap:10 }}>
          {[{ico:'🪣',lbl:'Sludge',dest:'BookSludge'},{ico:'💧',lbl:'Water',dest:'BookWater'},{ico:'📋',lbl:'History',dest:'History'},{ico:'👛',lbl:'Wallet',dest:'Wallet'}].map(q => (
            <TouchableOpacity key={q.lbl} style={s.qaItem} onPress={() => navigation.navigate(q.dest)} activeOpacity={0.8}>
              <Text style={{fontSize:22,marginBottom:5}}>{q.ico}</Text>
              <Text style={s.qaLbl}>{q.lbl}</Text>
            </TouchableOpacity>
          ))}
        </Row>
        <View style={[s.promo, { marginHorizontal:18, marginTop:14 }]}>
          <View><Text style={s.promoTitle}>💧 Save on Water</Text><Text style={s.promoSub}>Top up 500 MZN, get 50 free</Text></View>
          <View style={s.promoBtn}><Text style={s.promoBtnTxt}>Claim →</Text></View>
        </View>
        <Text style={[s.secTitle,{paddingHorizontal:18,marginTop:18}]}>Our Services</Text>
        <Row style={{ paddingHorizontal:18, gap:10, marginTop:8 }}>
          <TouchableOpacity style={[s.svcTile,{borderColor:'rgba(59,130,246,0.25)',backgroundColor:'#f8fbff'}]}
            onPress={() => navigation.navigate('BookWater')} activeOpacity={0.85}>
            <Text style={{fontSize:32,marginBottom:8}}>💧</Text>
            <Text style={s.svcName}>Water Delivery</Text>
            <Text style={s.svcPrice}>From 150 MZN</Text>
            <View style={[s.svcArrow,{backgroundColor:'#3b82f6'}]}><Text style={{color:'#fff',fontSize:14}}>→</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={[s.svcTile,{borderColor:'rgba(245,158,11,0.25)',backgroundColor:'#fffcf5'}]}
            onPress={() => navigation.navigate('BookSludge')} activeOpacity={0.85}>
            <Text style={{fontSize:32,marginBottom:8}}>🪣</Text>
            <Text style={s.svcName}>Septic Emptying</Text>
            <Text style={s.svcPrice}>From 300 MZN</Text>
            <View style={[s.svcArrow,{backgroundColor:'#f59e0b'}]}><Text style={{color:'#fff',fontSize:14}}>→</Text></View>
          </TouchableOpacity>
        </Row>
        <Text style={[s.secTitle,{paddingHorizontal:18,marginTop:20,marginBottom:6}]}>Recent Services</Text>
        {recent.map(item => (
          <TouchableOpacity key={item.id} style={s.recentRow}
            onPress={() => navigation.navigate('Tracking',{driver:'João Silva',type:item.name})} activeOpacity={0.8}>
            <View style={[s.recentIco,{backgroundColor:item.type==='water'?'#EEF2FF':'#FFF8E1'}]}>
              <Text style={{fontSize:18}}>{item.type==='water'?'💧':'🪣'}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={s.riName}>{item.name}</Text>
              <Text style={s.riMeta}>{item.meta}</Text>
            </View>
            <View style={{alignItems:'flex-end'}}>
              <Text style={s.riAmt}>{item.amount}</Text>
              <Badge label={item.status==='done'?'Done':'Pending'} type={item.status}/>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{height:24}}/>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  BOOK SLUDGE
// ══════════════════════════════════════════════════════════
function BookSludgeScreen({ navigation }) {
  const [tank, setTank] = useState('full');
  const [date, setDate] = useState(16);
  const [time, setTime] = useState('11:30');
  const tanks   = [{id:'partial',ico:'🪣',name:'Partial Empty',price:300},{id:'full',ico:'🪣🪣',name:'Full Empty',price:500}];
  const dates   = [14,15,16,17,18,19];
  const ddays   = ['SAT','SUN','MON','TUE','WED','THU'];
  const times   = ['07:00','08:30','10:00','11:30','13:00','14:30','16:00','17:30'];
  const offTime = ['07:00','08:30','17:30'];
  const price   = tanks.find(t=>t.id===tank)?.price ?? 500;
  return (
    <View style={[s.fill,{backgroundColor:C.white}]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white}/>
      <BackHeader title="Book Septic Service" navigation={navigation}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:18}}>
        <Text style={s.secTitle}>Tank Size</Text>
        <Row style={{gap:10,marginBottom:18}}>
          {tanks.map(t=>(
            <TouchableOpacity key={t.id} style={[s.optCard, tank===t.id&&{borderColor:C.p,backgroundColor:'rgba(107,59,160,0.04)'}]} onPress={()=>setTank(t.id)} activeOpacity={0.8}>
              <Text style={{fontSize:26,marginBottom:6}}>{t.ico}</Text>
              <Text style={s.optName}>{t.name}</Text>
              <Text style={s.optPrice}>{t.price} MZN</Text>
              {tank===t.id && <View style={s.optCheck}><Text style={{color:'#fff',fontSize:9}}>✓</Text></View>}
            </TouchableOpacity>
          ))}
        </Row>
        <Text style={s.secTitle}>Choose a Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:18}}>
          {dates.map((d,i)=>(
            <TouchableOpacity key={d} style={[s.dateChip, date===d&&{backgroundColor:C.p,borderColor:C.p}]} onPress={()=>setDate(d)}>
              <Text style={[s.dcDay, date===d&&{color:'rgba(255,255,255,0.7)'}]}>{ddays[i]}</Text>
              <Text style={[s.dcNum, date===d&&{color:'#fff'}]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={s.secTitle}>Available Times</Text>
        <View style={s.timeGrid}>
          {times.map(t=>{
            const off = offTime.includes(t);
            return (
              <TouchableOpacity key={t} style={[s.timeChip, time===t&&{backgroundColor:C.g,borderColor:C.g}, off&&{opacity:0.35}]} onPress={()=>!off&&setTime(t)} disabled={off} activeOpacity={0.8}>
                <Text style={[{fontSize:12,fontWeight:'500',color:C.t2}, time===t&&{color:'#fff'}]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={s.addrRow}>
          <Text style={{fontSize:18}}>📍</Text>
          <View style={{flex:1}}><Text style={s.addrLbl}>DELIVERY ADDRESS</Text><Text style={s.addrVal}>Av. Eduardo Mondlane 42, Maputo</Text></View>
          <Text style={{fontSize:12,color:C.p,fontWeight:'600'}}>Change</Text>
        </View>
        <Card style={{marginBottom:16}}>
          <Row style={{justifyContent:'space-between',marginBottom:6}}><Text style={s.csKey}>Septic ({tank==='full'?'Full':'Partial'})</Text><Text style={s.csVal}>{price} MZN</Text></Row>
          <Row style={{justifyContent:'space-between',marginBottom:8}}><Text style={s.csKey}>Service Fee</Text><Text style={s.csVal}>25 MZN</Text></Row>
          <View style={s.divider}/>
          <Row style={{justifyContent:'space-between'}}>
            <Text style={[s.csKey,{fontWeight:'700',color:C.t1,fontSize:13}]}>Total</Text>
            <Text style={[s.csVal,{color:C.p,fontSize:18,fontWeight:'800'}]}>{price+25} MZN</Text>
          </Row>
        </Card>
        <Btn label="Confirm Booking →" onPress={()=>navigation.navigate('DriverAssigned',{type:'Septic Emptying',amount:price+25,driver:'João Silva'})}/>
        <GhostBtn label="Cancel" onPress={()=>navigation.goBack()} style={{marginTop:10}}/>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  BOOK WATER
// ══════════════════════════════════════════════════════════
function BookWaterScreen({ navigation }) {
  const [qty,  setQty]  = useState('10000');
  const [date, setDate] = useState(16);
  const [time, setTime] = useState('10:00');
  const qtys    = [{id:'5000',ico:'💧',name:'5,000 L',price:150},{id:'10000',ico:'💧💧',name:'10,000 L',price:280},{id:'20000',ico:'💧💧💧',name:'20,000 L',price:500},{id:'30000',ico:'🚛',name:'30,000 L',price:700}];
  const dates   = [14,15,16,17,18,19];
  const ddays   = ['SAT','SUN','MON','TUE','WED','THU'];
  const times   = ['07:00','08:30','10:00','11:30','13:00','14:30'];
  const offTime = ['07:00'];
  const price   = qtys.find(q=>q.id===qty)?.price ?? 280;
  return (
    <View style={[s.fill,{backgroundColor:C.white}]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white}/>
      <BackHeader title="Order Water Delivery" navigation={navigation}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:18}}>
        <Text style={s.secTitle}>Select Quantity</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:18}}>
          {qtys.map(q=>(
            <TouchableOpacity key={q.id} style={[s.optCard,{width:(W-54)/2}, qty===q.id&&{borderColor:'#3b82f6',backgroundColor:'#eff6ff'}]} onPress={()=>setQty(q.id)} activeOpacity={0.8}>
              <Text style={{fontSize:26,marginBottom:6}}>{q.ico}</Text>
              <Text style={s.optName}>{q.name}</Text>
              <Text style={s.optPrice}>{q.price} MZN</Text>
              {qty===q.id && <View style={[s.optCheck,{backgroundColor:'#3b82f6'}]}><Text style={{color:'#fff',fontSize:9}}>✓</Text></View>}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.secTitle}>Choose a Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:18}}>
          {dates.map((d,i)=>(
            <TouchableOpacity key={d} style={[s.dateChip, date===d&&{backgroundColor:C.p,borderColor:C.p}]} onPress={()=>setDate(d)}>
              <Text style={[s.dcDay, date===d&&{color:'rgba(255,255,255,0.7)'}]}>{ddays[i]}</Text>
              <Text style={[s.dcNum, date===d&&{color:'#fff'}]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={s.secTitle}>Available Times</Text>
        <View style={s.timeGrid}>
          {times.map(t=>{
            const off = offTime.includes(t);
            return (
              <TouchableOpacity key={t} style={[s.timeChip, time===t&&{backgroundColor:'#3b82f6',borderColor:'#3b82f6'}, off&&{opacity:0.35}]} onPress={()=>!off&&setTime(t)} disabled={off} activeOpacity={0.8}>
                <Text style={[{fontSize:12,fontWeight:'500',color:C.t2}, time===t&&{color:'#fff'}]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={s.addrRow}>
          <Text style={{fontSize:18}}>📍</Text>
          <View style={{flex:1}}><Text style={s.addrLbl}>DELIVERY ADDRESS</Text><Text style={s.addrVal}>Av. Eduardo Mondlane 42, Maputo</Text></View>
          <Text style={{fontSize:12,color:'#3b82f6',fontWeight:'600'}}>Change</Text>
        </View>
        <Card style={{marginBottom:16}}>
          <Row style={{justifyContent:'space-between',marginBottom:6}}><Text style={s.csKey}>Water ({qtys.find(q=>q.id===qty)?.name})</Text><Text style={s.csVal}>{price} MZN</Text></Row>
          <Row style={{justifyContent:'space-between',marginBottom:8}}><Text style={s.csKey}>Delivery Fee</Text><Text style={s.csVal}>20 MZN</Text></Row>
          <View style={s.divider}/>
          <Row style={{justifyContent:'space-between'}}>
            <Text style={[s.csKey,{fontWeight:'700',color:C.t1,fontSize:13}]}>Total</Text>
            <Text style={[s.csVal,{color:'#3b82f6',fontSize:18,fontWeight:'800'}]}>{price+20} MZN</Text>
          </Row>
        </Card>
        <Btn label="Confirm Delivery →" bg="#3b82f6" onPress={()=>navigation.navigate('DriverAssigned',{type:'Water Delivery',amount:price+20,driver:'Manuel Costa',qty:qtys.find(q=>q.id===qty)?.name})}/>
        <GhostBtn label="Cancel" onPress={()=>navigation.goBack()} style={{marginTop:10}}/>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  DRIVER ASSIGNED
// ══════════════════════════════════════════════════════════
function DriverAssignedScreen({ navigation, route }) {
  const { type='Septic Emptying', amount=525, driver='João Silva', qty='' } = route.params ?? {};
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.loop(Animated.sequence([
      Animated.timing(bounce,{toValue:-8,duration:600,useNativeDriver:true}),
      Animated.timing(bounce,{toValue:0,duration:600,useNativeDriver:true}),
    ])).start();
  },[]);
  const steps = [
    {lbl:'Booking Confirmed',time:'09:14 · Mar 14',st:'done'},
    {lbl:'Driver Assigned',time:`${driver} assigned`,st:'curr'},
    {lbl:'Service in Progress',time:'—',st:'wait'},
    {lbl:'Complete & Rate',time:'—',st:'wait'},
  ];
  return (
    <View style={[s.fill,{backgroundColor:C.bg}]}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg}/>
      <View style={[s.daHero,{backgroundColor:C.darkMid}]}>
        <SafeAreaView style={{alignItems:'center'}}>
          <Animated.Text style={{fontSize:52,transform:[{translateY:bounce}]}}>🚛</Animated.Text>
          <Text style={s.daTitle}>Driver Assigned!</Text>
          <Text style={s.daSub}>{type}{qty?` · ${qty}`:''}</Text>
          <View style={s.etaBadge}><View style={s.etaDot}/><Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>ETA: 12 minutes</Text></View>
        </SafeAreaView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:18}}>
        <Card style={{flexDirection:'row',alignItems:'center',gap:12,marginBottom:12}}>
          <View style={s.driverAv}><Text style={{fontSize:26}}>👨🏾</Text></View>
          <View style={{flex:1}}><Text style={s.riName}>{driver}</Text><Text style={s.riMeta}>⭐ 4.8 · Truck KA-12-31-MZ</Text></View>
          <Row style={{gap:8}}>
            <TouchableOpacity style={[s.drBtn,{backgroundColor:C.gl}]}><Text style={{fontSize:18}}>📞</Text></TouchableOpacity>
            <TouchableOpacity style={[s.drBtn,{backgroundColor:'rgba(107,59,160,0.1)'}]}><Text style={{fontSize:18}}>💬</Text></TouchableOpacity>
          </Row>
        </Card>
        <Card style={{marginBottom:12}}>
          <Text style={[s.secTitle,{marginBottom:10}]}>Order Summary</Text>
          <Row style={{justifyContent:'space-between',marginBottom:6}}><Text style={s.csKey}>{type}</Text><Text style={s.csVal}>{amount} MZN</Text></Row>
          <Row style={{justifyContent:'space-between'}}><Text style={s.csKey}>Payment</Text><Text style={s.csVal}>Wallet</Text></Row>
        </Card>
        <Card style={{marginBottom:16}}>
          <Text style={[s.secTitle,{marginBottom:14}]}>Service Progress</Text>
          {steps.map((st,i)=>(
            <View key={i} style={{flexDirection:'row',gap:12,marginBottom:i<steps.length-1?14:0,position:'relative'}}>
              {i>0&&<View style={{position:'absolute',top:-14,left:13,width:2,height:14,backgroundColor:steps[i-1].st==='done'?C.g:'#e5dff0'}}/>}
              <View style={[s.stepOrb, st.st==='done'&&{backgroundColor:C.g}, st.st==='curr'&&{backgroundColor:C.p}, st.st==='wait'&&{backgroundColor:'#ede8f5'}]}>
                <Text style={{color:st.st==='wait'?C.t2:'#fff',fontSize:11,fontWeight:'700'}}>{st.st==='done'?'✓':st.st==='curr'?'→':i+1}</Text>
              </View>
              <View><Text style={[s.riName,st.st==='wait'&&{color:C.t2}]}>{st.lbl}</Text><Text style={s.riMeta}>{st.time}</Text></View>
            </View>
          ))}
        </Card>
        <Row style={{gap:10,marginBottom:10}}>
          <TouchableOpacity style={s.halfGhost} onPress={()=>navigation.goBack()}><Text style={{color:C.t2,fontWeight:'600',fontSize:12}}>✕ Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={[s.halfGhost,{backgroundColor:C.p,borderColor:C.p}]} onPress={()=>navigation.navigate('Tracking',{driver,type})}><Text style={{color:'#fff',fontWeight:'600',fontSize:12}}>📍 Live Track</Text></TouchableOpacity>
        </Row>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  LIVE TRACKING
// ══════════════════════════════════════════════════════════
function TrackingScreen({ navigation, route }) {
  const { driver='João Silva', type='Septic Emptying' } = route.params ?? {};
  const [eta, setEta] = useState(8);
  useEffect(()=>{
    const t = setInterval(()=>setEta(e=>{ if(e<=1){clearInterval(t);return 0;} return e-1; }),3000);
    return ()=>clearInterval(t);
  },[]);
  const steps = [
    {lbl:'Booking Confirmed',time:'09:14 · Mar 14',st:'done'},
    {lbl:'Driver Assigned',time:driver,st:'done'},
    {lbl:'En Route',time:`2.1 km away · ${eta} min`,st:'curr'},
    {lbl:'Service in Progress',time:'—',st:'wait'},
    {lbl:'Complete & Rate',time:'—',st:'wait'},
  ];
  return (
    <View style={[s.fill,{backgroundColor:C.white}]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white}/>
      <View style={s.mapZone}>
        {[55,115,175].map(y=><View key={y} style={{position:'absolute',left:0,right:0,top:y,height:9,backgroundColor:'#fff'}}/>)}
        {[70,145,220].map(x=><View key={x} style={{position:'absolute',top:0,bottom:0,left:x,width:9,backgroundColor:'#fff'}}/>)}
        {[[5,5,55,40],[80,5,55,40],[154,5,56,40],[219,5,60,40],[5,64,55,42],[80,64,55,42],[154,64,56,42],[219,64,60,42],[5,124,55,42],[80,124,55,42],[154,124,56,42],[219,124,60,42],[5,184,55,60],[80,184,55,60],[154,184,56,60],[219,184,60,60]].map((b,i)=>(
          <View key={i} style={{position:'absolute',left:b[0],top:b[1],width:b[2],height:b[3],backgroundColor:i%2===0?'#cddec6':'#d4e8cc',borderRadius:4,opacity:0.75}}/>
        ))}
        <View style={{position:'absolute',left:80,top:111,width:100,height:3,backgroundColor:C.p,borderRadius:2}}/>
        <View style={{position:'absolute',left:177,top:60,width:3,height:54,backgroundColor:C.p,borderRadius:2}}/>
        <View style={{position:'absolute',left:32,top:85}}>
          <View style={s.truckBub}><Text style={{fontSize:15}}>🚛</Text><Text style={{color:'#fff',fontSize:11,fontWeight:'700'}}>{driver}</Text></View>
          <View style={{width:0,height:0,borderLeftWidth:6,borderRightWidth:6,borderTopWidth:7,borderLeftColor:'transparent',borderRightColor:'transparent',borderTopColor:C.p,alignSelf:'center'}}/>
        </View>
        <View style={{position:'absolute',right:46,top:46,alignItems:'center'}}>
          <View style={{width:30,height:30,borderRadius:15,backgroundColor:'#fff',borderWidth:3,borderColor:C.g,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:13}}>🏠</Text></View>
          <View style={{backgroundColor:'#fff',paddingHorizontal:7,paddingVertical:2,borderRadius:6,marginTop:3}}><Text style={{fontSize:10,fontWeight:'600',color:C.t1}}>Your Home</Text></View>
        </View>
        <View style={s.mapTop}>
          <TouchableOpacity style={s.mtBtn} onPress={()=>navigation.goBack()}><Text style={{fontSize:16}}>←</Text></TouchableOpacity>
          <View style={{alignItems:'center'}}>
            <Text style={{fontSize:14,fontWeight:'700',color:C.t1}}>Live Tracking</Text>
            <View style={[s.etaBadge,{marginTop:4,paddingVertical:3,paddingHorizontal:10}]}><Text style={{color:'#fff',fontSize:11,fontWeight:'600'}}>{eta>0?`● ETA ${eta} mins`:'● Arriving now!'}</Text></View>
          </View>
          <View style={s.mtBtn}><Text style={{fontSize:16}}>◎</Text></View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}} contentContainerStyle={{padding:16}}>
        <View style={s.sheetHandle}/>
        <Card style={{flexDirection:'row',alignItems:'center',gap:12,marginBottom:12}}>
          <View style={[s.driverAv,{width:50,height:50,borderRadius:14}]}><Text style={{fontSize:22}}>👨🏾</Text></View>
          <View style={{flex:1}}><Text style={s.riName}>{driver}</Text><Text style={s.riMeta}>⭐ 4.8 · Truck KA-12-31-MZ</Text></View>
          <Row style={{gap:7}}>
            <TouchableOpacity style={[s.drBtn,{backgroundColor:C.gl}]}><Text>📞</Text></TouchableOpacity>
            <TouchableOpacity style={[s.drBtn,{backgroundColor:'rgba(107,59,160,0.1)'}]}><Text>💬</Text></TouchableOpacity>
          </Row>
        </Card>
        <Card style={{marginBottom:12}}>
          <Text style={[s.secTitle,{marginBottom:14}]}>Service Progress</Text>
          {steps.map((st,i)=>(
            <View key={i} style={{flexDirection:'row',gap:12,marginBottom:i<steps.length-1?14:0,position:'relative'}}>
              {i>0&&<View style={{position:'absolute',top:-14,left:12,width:2,height:14,backgroundColor:steps[i-1].st==='done'?C.g:'#e5dff0'}}/>}
              <View style={[s.stepOrb,{width:26,height:26,borderRadius:13}, st.st==='done'&&{backgroundColor:C.g}, st.st==='curr'&&{backgroundColor:C.p}, st.st==='wait'&&{backgroundColor:'#ede8f5'}]}>
                <Text style={{color:st.st==='wait'?C.t2:'#fff',fontSize:10,fontWeight:'700'}}>{st.st==='done'?'✓':st.st==='curr'?'→':i+1}</Text>
              </View>
              <View><Text style={[s.riName,st.st==='wait'&&{color:C.t2}]}>{st.lbl}</Text><Text style={s.riMeta}>{st.time}</Text></View>
            </View>
          ))}
        </Card>
        <Row style={{gap:9}}>
          <TouchableOpacity style={s.halfGhost} onPress={()=>navigation.goBack()}><Text style={{color:C.t2,fontWeight:'600',fontSize:12}}>✕ Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={[s.halfGhost,{backgroundColor:C.p,borderColor:C.p}]} onPress={()=>navigation.navigate('Complete',{driver,type})}><Text style={{color:'#fff',fontWeight:'600',fontSize:12}}>✓ Mark Complete</Text></TouchableOpacity>
        </Row>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  COMPLETE
// ══════════════════════════════════════════════════════════
function CompleteScreen({ navigation, route }) {
  const { driver='João Silva', type='Septic Emptying' } = route.params ?? {};
  const [rating, setRating] = useState(5);
  const sc = useRef(new Animated.Value(0)).current;
  useEffect(()=>{ Animated.spring(sc,{toValue:1,tension:50,friction:5,useNativeDriver:true}).start(); },[]);
  return (
    <View style={[s.fill,{backgroundColor:C.bg}]}>
      <StatusBar barStyle="light-content" backgroundColor={C.gd}/>
      <View style={[s.completeHero,{backgroundColor:C.g}]}>
        <SafeAreaView style={{alignItems:'center'}}>
          <Animated.Text style={{fontSize:64,transform:[{scale:sc}]}}>✅</Animated.Text>
          <Text style={s.completeTitle}>Service Complete!</Text>
          <Text style={{fontSize:13,color:'rgba(255,255,255,0.65)',marginTop:4}}>Thank you for using SENAQUA</Text>
        </SafeAreaView>
      </View>
      <ScrollView contentContainerStyle={{padding:18}}>
        <Card style={{marginBottom:12}}>
          <Text style={s.csKey}>Service</Text>
          <Text style={[s.riName,{fontSize:16,marginTop:4,marginBottom:12}]}>{type}</Text>
          <View style={s.divider}/>
          <Row style={{justifyContent:'space-between',marginTop:8,marginBottom:6}}><Text style={s.csKey}>Driver</Text><Text style={s.csVal}>{driver}</Text></Row>
          <Row style={{justifyContent:'space-between',marginBottom:6}}><Text style={s.csKey}>Date</Text><Text style={s.csVal}>Mar 14, 2026</Text></Row>
          <Row style={{justifyContent:'space-between'}}><Text style={s.csKey}>Status</Text><Badge label="Done" type="done"/></Row>
        </Card>
        <Card style={{marginBottom:12,alignItems:'center',paddingVertical:20}}>
          <Text style={s.csKey}>Total Paid</Text>
          <Text style={{fontSize:36,fontWeight:'800',color:C.g,marginTop:6}}>525 MZN</Text>
          <Text style={[s.riMeta,{marginTop:4}]}>Paid from Wallet</Text>
        </Card>
        <Card style={{marginBottom:20,alignItems:'center',paddingVertical:16}}>
          <Text style={[s.secTitle,{marginBottom:14}]}>Rate Your Experience</Text>
          <Row style={{gap:8,marginBottom:8}}>
            {[1,2,3,4,5].map(n=>(
              <TouchableOpacity key={n} onPress={()=>setRating(n)}>
                <Text style={{fontSize:32,opacity:n<=rating?1:0.2}}>⭐</Text>
              </TouchableOpacity>
            ))}
          </Row>
          <Text style={s.csKey}>{['','Poor','Fair','Good','Very Good','Excellent'][rating]}</Text>
        </Card>
        <Btn label="Submit & Done" bg={C.g} onPress={()=>navigation.navigate('Main')}/>
        <GhostBtn label="Skip" onPress={()=>navigation.navigate('Main')} style={{marginTop:10}}/>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  HISTORY TAB
// ══════════════════════════════════════════════════════════
function HistoryScreen({ navigation }) {
  const [tab, setTab] = useState('all');
  const all = [
    {id:'1',type:'water', name:'Water Delivery', meta:'10,000L · Mar 12',amount:'280 MZN',status:'done', month:'March 2026'},
    {id:'2',type:'sludge',name:'Septic Emptying',meta:'Full · Mar 8',    amount:'500 MZN',status:'done', month:'March 2026'},
    {id:'3',type:'water', name:'Water Delivery', meta:'5,000L · Mar 3',  amount:'150 MZN',status:'pend', month:'March 2026'},
    {id:'4',type:'sludge',name:'Septic Emptying',meta:'Partial · Feb 22',amount:'300 MZN',status:'done', month:'February 2026'},
    {id:'5',type:'water', name:'Water Delivery', meta:'20,000L · Feb 10',amount:'500 MZN',status:'cancel',month:'February 2026'},
    {id:'6',type:'sludge',name:'Septic Emptying',meta:'Full · Jan 28',   amount:'500 MZN',status:'done', month:'January 2026'},
  ];
  const items = tab==='all'?all:all.filter(i=>i.type===tab);
  return (
    <View style={[s.fill,{backgroundColor:C.bg}]}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkMid}/>
      <View style={[s.histHdr,{backgroundColor:C.darkMid}]}>
        <SafeAreaView>
          <Row style={{justifyContent:'space-between',marginBottom:14}}>
            <Text style={{fontSize:20,fontWeight:'700',color:'#fff'}}>My Services</Text>
            <View style={{backgroundColor:'rgba(255,255,255,0.15)',borderRadius:8,paddingHorizontal:10,paddingVertical:6}}><Text style={{color:'#fff',fontSize:12}}>⚙ Filter</Text></View>
          </Row>
          <Row style={{gap:8}}>
            {[['all','All'],['water','Water'],['sludge','Sludge']].map(([id,lbl])=>(
              <TouchableOpacity key={id} style={[s.histTab, tab===id&&{backgroundColor:'#fff'}]} onPress={()=>setTab(id)}>
                <Text style={[{fontSize:12,fontWeight:'500',color:'rgba(255,255,255,0.7)'}, tab===id&&{color:C.p}]}>{lbl}</Text>
              </TouchableOpacity>
            ))}
          </Row>
        </SafeAreaView>
      </View>
      <View style={s.histSummary}>
        {[['12','Total'],['3,240','MZN Spent'],['4.8 ⭐','Rating']].map(([val,lbl],i)=>(
          <React.Fragment key={lbl}>
            {i>0&&<View style={{width:1,height:32,backgroundColor:C.bdr}}/>}
            <View style={{alignItems:'center'}}><Text style={{fontSize:18,fontWeight:'700',color:C.p}}>{val}</Text><Text style={{fontSize:10,color:C.t2,marginTop:2}}>{lbl}</Text></View>
          </React.Fragment>
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:16}}>
        {items.map((item,i)=>{
          const showMonth = i===0||items[i-1].month!==item.month;
          return (
            <View key={item.id}>
              {showMonth&&<Text style={s.monthLbl}>{item.month}</Text>}
              <TouchableOpacity style={[s.card,{flexDirection:'row',alignItems:'center',gap:12,marginBottom:10}]} onPress={()=>navigation.navigate('Tracking',{driver:'João Silva',type:item.name})} activeOpacity={0.8}>
                <View style={[s.recentIco,{backgroundColor:item.type==='water'?'#EEF2FF':'#FFF8E1'}]}><Text style={{fontSize:18}}>{item.type==='water'?'💧':'🪣'}</Text></View>
                <View style={{flex:1}}><Text style={s.riName}>{item.name}</Text><Text style={s.riMeta}>{item.meta}</Text></View>
                <View style={{alignItems:'flex-end'}}>
                  <Text style={s.riAmt}>{item.amount}</Text>
                  <Badge label={item.status==='done'?'Done':item.status==='pend'?'Pending':'Cancelled'} type={item.status==='cancel'?'cancel':item.status}/>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
        <View style={{height:20}}/>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  WALLET TAB
// ══════════════════════════════════════════════════════════
function WalletScreen() {
  const txns = [
    {id:'1',ico:'💚',name:'Top Up via M-Pesa',date:'Mar 11 · 09:14',amt:'+500',credit:true},
    {id:'2',ico:'💧',name:'Water Delivery',    date:'Mar 9 · 14:30', amt:'–280',credit:false},
    {id:'3',ico:'🪣',name:'Septic Service',    date:'Mar 8 · 10:05', amt:'–500',credit:false},
    {id:'4',ico:'💚',name:'Top Up via Bank',   date:'Feb 28 · 16:45',amt:'+1,200',credit:true},
  ];
  return (
    <View style={[s.fill,{backgroundColor:'#f7f6fa'}]}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg}/>
      <View style={[s.walletHdr,{backgroundColor:C.darkBg}]}>
        <SafeAreaView>
          <Row style={{justifyContent:'space-between',marginBottom:20}}>
            <Text style={{fontSize:17,fontWeight:'600',color:'#fff'}}>My Wallet</Text>
            <View style={{width:36,height:36,backgroundColor:'rgba(255,255,255,0.1)',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:16}}>🔔</Text></View>
          </Row>
          <View style={{alignItems:'center',marginBottom:20}}>
            <Text style={{fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:1,textTransform:'uppercase'}}>Available Balance</Text>
            <Text style={{fontSize:42,fontWeight:'800',color:'#fff',letterSpacing:-1,marginVertical:6}}><Text style={{fontSize:18,opacity:0.5}}>MZN </Text>1,450</Text>
            <Text style={{fontSize:12,color:'#4ade80'}}>▲ 280 MZN added this month</Text>
          </View>
          <View style={[s.walletCard,{backgroundColor:C.p}]}>
            <View><Text style={{fontSize:10,color:'rgba(255,255,255,0.55)',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>Account</Text><Text style={{fontSize:15,fontWeight:'600',color:'#fff',letterSpacing:1}}>SQA · 8471 · MZ</Text></View>
            <Row style={{gap:12}}>
              {[['＋','Top Up'],['↗','Send'],['⋯','More']].map(([ico,lbl])=>(
                <View key={lbl} style={{alignItems:'center',gap:4}}>
                  <View style={{width:36,height:36,backgroundColor:'rgba(255,255,255,0.15)',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff',fontSize:16}}>{ico}</Text></View>
                  <Text style={{fontSize:10,color:'rgba(255,255,255,0.6)'}}>{lbl}</Text>
                </View>
              ))}
            </Row>
          </View>
        </SafeAreaView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:18}}>
        <Row style={{gap:10,marginBottom:16}}>
          {[['💳','Pay Bill'],['📲','M-Pesa'],['🏦','Bank'],['🎁','Voucher']].map(([ico,lbl])=>(
            <TouchableOpacity key={lbl} style={s.qaItem} activeOpacity={0.8}><Text style={{fontSize:20,marginBottom:5}}>{ico}</Text><Text style={s.qaLbl}>{lbl}</Text></TouchableOpacity>
          ))}
        </Row>
        <View style={[s.promo,{marginBottom:16}]}>
          <View><Text style={s.promoTitle}>💧 Save on Water</Text><Text style={s.promoSub}>Top up 500 MZN, get 50 free</Text></View>
          <View style={s.promoBtn}><Text style={s.promoBtnTxt}>Claim →</Text></View>
        </View>
        <Text style={[s.secTitle,{marginBottom:10}]}>Recent Transactions</Text>
        {txns.map(t=>(
          <Card key={t.id} style={{flexDirection:'row',alignItems:'center',gap:12,marginBottom:8}}>
            <View style={[s.recentIco,{backgroundColor:t.credit?C.gl:'#FFF0F0'}]}><Text style={{fontSize:18}}>{t.ico}</Text></View>
            <View style={{flex:1}}><Text style={s.riName}>{t.name}</Text><Text style={s.riMeta}>{t.date}</Text></View>
            <Text style={{fontSize:14,fontWeight:'700',color:t.credit?C.g:C.red}}>{t.amt}</Text>
          </Card>
        ))}
        <View style={{height:20}}/>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  PROFILE TAB
// ══════════════════════════════════════════════════════════
function ProfileScreen({ navigation }) {
  const groups = [
    {title:'Account',items:[{ico:'👤',bg:'rgba(107,59,160,0.1)',name:'Personal Details',desc:'Name, phone, email',badge:null},{ico:'📍',bg:'rgba(0,166,81,0.1)',name:'Saved Addresses',desc:'Home, work & more',badge:null},{ico:'🔔',bg:'rgba(244,168,32,0.1)',name:'Notifications',desc:'Alerts & reminders',badge:'2'}]},
    {title:'Support',items:[{ico:'💬',bg:'rgba(107,59,160,0.1)',name:'Help Centre',desc:'FAQs & live chat',badge:null},{ico:'🚨',bg:'rgba(229,62,62,0.1)',name:'Report a Problem',desc:'Something went wrong?',badge:null}]},
  ];
  return (
    <View style={[s.fill,{backgroundColor:'#f8f7fc'}]}>
      <StatusBar barStyle="light-content" backgroundColor={C.darkBg}/>
      <View style={[s.profileHero,{backgroundColor:'#2d1060'}]}>
        <SafeAreaView style={{alignItems:'center'}}>
          <Row style={{alignSelf:'stretch',justifyContent:'flex-end',marginBottom:16}}>
            <View style={[s.tbBtn,{backgroundColor:'rgba(255,255,255,0.12)',borderWidth:0}]}><Text style={s.tbBtnTxt}>⚙️</Text></View>
          </Row>
          <View style={s.profileAv}><Text style={{fontSize:36}}>👩🏾</Text><View style={s.profileAvEdit}><Text style={{fontSize:10}}>✏</Text></View></View>
          <Text style={{fontSize:20,fontWeight:'700',color:'#fff',marginBottom:4}}>Ana Machava</Text>
          <Text style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:14}}>+258 84 321 7890 · Maputo Sul</Text>
          <Row style={{gap:8}}>
            <Row style={s.profPill}><View style={s.liveDot}/><Text style={s.profPillTxt}>Verified</Text></Row>
            <Row style={s.profPill}><Text style={s.profPillTxt}>⭐ 4.9 Customer</Text></Row>
          </Row>
        </SafeAreaView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:16}}>
        <Card style={{flexDirection:'row',marginBottom:16}}>
          {[['12','Services'],['1,450','Balance'],['3','Addresses']].map(([val,lbl],i)=>(
            <React.Fragment key={lbl}>
              {i>0&&<View style={{width:1,backgroundColor:C.bdr}}/>}
              <View style={{flex:1,alignItems:'center',paddingVertical:4}}><Text style={{fontSize:18,fontWeight:'700',color:C.p}}>{val}</Text><Text style={{fontSize:10,color:C.t2,marginTop:2}}>{lbl}</Text></View>
            </React.Fragment>
          ))}
        </Card>
        {groups.map(g=>(
          <View key={g.title}>
            <Text style={[s.secTitle,{marginBottom:8}]}>{g.title}</Text>
            <View style={[s.card,{padding:0,marginBottom:14,overflow:'hidden'}]}>
              {g.items.map((item,i)=>(
                <TouchableOpacity key={item.name} style={[{flexDirection:'row',alignItems:'center',gap:12,padding:14}, i>0&&{borderTopWidth:1,borderTopColor:C.bdr}]} activeOpacity={0.75}>
                  <View style={{width:36,height:36,borderRadius:10,backgroundColor:item.bg,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:17}}>{item.ico}</Text></View>
                  <View style={{flex:1}}><Text style={s.riName}>{item.name}</Text><Text style={s.riMeta}>{item.desc}</Text></View>
                  {item.badge&&<View style={{backgroundColor:C.red,borderRadius:10,paddingHorizontal:7,paddingVertical:2,marginRight:6}}><Text style={{color:'#fff',fontSize:10,fontWeight:'700'}}>{item.badge}</Text></View>}
                  <Text style={{color:C.t3,fontSize:18}}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity style={s.logoutBtn} onPress={()=>navigation.navigate('Login')}><Text style={{color:C.red,fontWeight:'600',fontSize:13}}>↩  Sign Out</Text></TouchableOpacity>
        <View style={{height:20}}/>
      </ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  TABS + ROOT NAVIGATOR
// ══════════════════════════════════════════════════════════
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown:false,
      tabBarStyle:{backgroundColor:'#fff',borderTopColor:C.bdr,height:Platform.OS==='ios'?80:60,paddingBottom:Platform.OS==='ios'?20:8},
      tabBarActiveTintColor:C.p, tabBarInactiveTintColor:C.t3,
      tabBarLabelStyle:{fontSize:10,fontWeight:'500'},
    }}>
      <Tab.Screen name="Home"    component={HomeScreen}    options={{tabBarIcon:()=><Text style={{fontSize:20}}>🏠</Text>}}/>
      <Tab.Screen name="History" component={HistoryScreen} options={{tabBarIcon:()=><Text style={{fontSize:20}}>📋</Text>}}/>
      <Tab.Screen name="Wallet"  component={WalletScreen}  options={{tabBarIcon:()=><Text style={{fontSize:20}}>👛</Text>}}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarIcon:()=><Text style={{fontSize:20}}>👤</Text>}}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false,animation:'slide_from_right'}}>
        <Stack.Screen name="Splash"           component={SplashScreen}/>
        <Stack.Screen name="Login"            component={LoginScreen}/>
        <Stack.Screen name="Register"         component={RegisterScreen}/>
        <Stack.Screen name="RegisterStep2"    component={RegisterStep2Screen}/>
        <Stack.Screen name="RegisterStep3"    component={RegisterStep3Screen}/>
        <Stack.Screen name="RegisterSuccess"  component={RegisterSuccessScreen}/>
        <Stack.Screen name="Main"             component={MainTabs}/>
        <Stack.Screen name="BookSludge"       component={BookSludgeScreen}/>
        <Stack.Screen name="BookWater"        component={BookWaterScreen}/>
        <Stack.Screen name="DriverAssigned"   component={DriverAssignedScreen}/>
        <Stack.Screen name="Tracking"         component={TrackingScreen}/>
        <Stack.Screen name="Complete"         component={CompleteScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ══════════════════════════════════════════════════════════
//  STYLES
// ══════════════════════════════════════════════════════════
const s = StyleSheet.create({
  fill:{flex:1}, btn:{width:'100%',padding:15,borderRadius:14,alignItems:'center'},
  btnTxt:{color:'#fff',fontWeight:'700',fontSize:14},
  ghostBtn:{width:'100%',padding:13,borderRadius:14,alignItems:'center',borderWidth:1.5,borderColor:'#e0d8ef'},
  ghostBtnTxt:{fontSize:13,fontWeight:'500',color:C.t2},
  card:{backgroundColor:C.card,borderRadius:16,padding:14,borderWidth:1,borderColor:C.bdr},
  secTitle:{fontSize:13,fontWeight:'700',color:C.t1,marginBottom:10},
  badge:{paddingHorizontal:8,paddingVertical:2,borderRadius:20,marginTop:3},
  badgeTxt:{fontSize:10,fontWeight:'600'},
  divider:{height:1,backgroundColor:C.bdr,marginVertical:8},
  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:12,backgroundColor:C.white},
  tbBtn:{width:36,height:36,backgroundColor:'#f5f3f9',borderRadius:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.bdr},
  tbBtnTxt:{fontSize:18}, topTitle:{fontSize:16,fontWeight:'700',color:C.t1},
  splashLogo:{width:90,height:90,backgroundColor:C.pd,borderRadius:28,alignItems:'center',justifyContent:'center'},
  splashTitle:{fontSize:36,fontWeight:'800',color:'#fff',letterSpacing:2},
  splashSub:{fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:6},
  barTrack:{position:'absolute',bottom:56,width:140,height:4,backgroundColor:'rgba(255,255,255,0.1)',borderRadius:4,overflow:'hidden'},
  barFill:{height:4,borderRadius:4,backgroundColor:C.g},
  loginLogo:{width:64,height:64,backgroundColor:C.pd,borderRadius:20,alignItems:'center',justifyContent:'center',marginBottom:16},
  loginTitle:{fontSize:28,fontWeight:'800',color:'#fff',letterSpacing:2},
  loginSub:{fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:6,marginBottom:24},
  livePill:{gap:6,backgroundColor:'rgba(255,255,255,0.08)',borderRadius:20,paddingHorizontal:14,paddingVertical:6,borderWidth:1,borderColor:'rgba(255,255,255,0.1)'},
  liveDot:{width:6,height:6,borderRadius:3,backgroundColor:C.g},
  liveTxt:{fontSize:11,color:'rgba(255,255,255,0.55)'},
  loginForm:{padding:22,paddingBottom:32},
  inpLbl:{fontSize:10,fontWeight:'600',color:'rgba(255,255,255,0.35)',letterSpacing:1,textTransform:'uppercase',marginBottom:5},
  darkInp:{backgroundColor:'rgba(255,255,255,0.08)',borderWidth:1,borderColor:'rgba(255,255,255,0.12)',borderRadius:12,padding:13,fontSize:14,color:'#fff',marginBottom:4},
  forgotTxt:{fontSize:11,color:'rgba(255,255,255,0.35)'},
  orRow:{gap:10,marginVertical:10}, orLine:{flex:1,height:1,backgroundColor:'rgba(255,255,255,0.08)'},
  orTxt:{fontSize:11,color:'rgba(255,255,255,0.25)'},
  ghostDark:{width:'100%',padding:13,borderRadius:12,alignItems:'center',borderWidth:1,borderColor:'rgba(255,255,255,0.15)'},
  ghostDarkTxt:{fontSize:13,color:'rgba(255,255,255,0.55)',fontWeight:'500'},
  homeHdr:{paddingHorizontal:20,paddingBottom:22},
  greet:{fontSize:12,color:'rgba(255,255,255,0.5)'}, userName:{fontSize:18,fontWeight:'700',color:'#fff',marginTop:2},
  avatar:{width:44,height:44,borderRadius:14,backgroundColor:'rgba(192,132,252,0.5)',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'rgba(255,255,255,0.2)'},
  balLbl:{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:1,textTransform:'uppercase'},
  balAmt:{fontSize:30,fontWeight:'800',color:'#fff',letterSpacing:-0.5,marginVertical:4},
  balSub:{fontSize:11,color:'rgba(255,255,255,0.45)'},
  qaItem:{flex:1,backgroundColor:C.card,borderRadius:14,padding:12,alignItems:'center',borderWidth:1,borderColor:C.bdr},
  qaLbl:{fontSize:10,fontWeight:'500',color:C.t2},
  promo:{backgroundColor:C.g,borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  promoTitle:{fontSize:13,fontWeight:'700',color:'#fff',marginBottom:3}, promoSub:{fontSize:11,color:'rgba(255,255,255,0.65)'},
  promoBtn:{backgroundColor:'rgba(255,255,255,0.2)',borderRadius:10,paddingHorizontal:12,paddingVertical:7,borderWidth:1,borderColor:'rgba(255,255,255,0.3)'},
  promoBtnTxt:{fontSize:11,fontWeight:'600',color:'#fff'},
  svcTile:{flex:1,borderRadius:18,padding:18,borderWidth:1.5,position:'relative'},
  svcName:{fontSize:13,fontWeight:'700',color:C.t1,marginBottom:3}, svcPrice:{fontSize:11,color:C.t2},
  svcArrow:{position:'absolute',bottom:14,right:14,width:28,height:28,borderRadius:8,alignItems:'center',justifyContent:'center'},
  recentRow:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:18,paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.bdr,backgroundColor:C.white},
  recentIco:{width:40,height:40,borderRadius:12,alignItems:'center',justifyContent:'center'},
  riName:{fontSize:13,fontWeight:'500',color:C.t1,marginBottom:2}, riMeta:{fontSize:11,color:C.t2}, riAmt:{fontSize:13,fontWeight:'700',color:C.t1},
  optCard:{flex:1,borderWidth:2,borderColor:'#ede8f5',borderRadius:14,padding:14,alignItems:'center',backgroundColor:'#fdfcfe'},
  optName:{fontSize:12,fontWeight:'700',color:C.t1,marginBottom:3,textAlign:'center'}, optPrice:{fontSize:11,color:C.t2},
  optCheck:{width:16,height:16,backgroundColor:C.p,borderRadius:8,alignItems:'center',justifyContent:'center',marginTop:6},
  dateChip:{paddingHorizontal:14,paddingVertical:10,borderRadius:12,borderWidth:1.5,borderColor:'#ede8f5',marginRight:8,alignItems:'center',minWidth:54,backgroundColor:'#fdfcfe'},
  dcDay:{fontSize:10,color:C.t2,fontWeight:'500',marginBottom:2}, dcNum:{fontSize:15,fontWeight:'700',color:C.t1},
  timeGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:14},
  timeChip:{width:(W-36-16)/3,padding:9,borderRadius:10,borderWidth:1.5,borderColor:'#ede8f5',alignItems:'center',backgroundColor:'#fdfcfe'},
  addrRow:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#f8f7fc',borderRadius:14,borderWidth:1.5,borderColor:'#ede8f5',padding:12,marginBottom:14},
  addrLbl:{fontSize:10,fontWeight:'600',color:C.t2,letterSpacing:1,textTransform:'uppercase',marginBottom:2},
  addrVal:{fontSize:13,color:C.t1,fontWeight:'500'}, csKey:{fontSize:12,color:C.t2}, csVal:{fontSize:12,fontWeight:'600',color:C.t1},
  daHero:{paddingHorizontal:20,paddingBottom:28}, daTitle:{fontSize:20,fontWeight:'700',color:'#fff',marginTop:10,marginBottom:6},
  daSub:{fontSize:12,color:'rgba(255,255,255,0.5)'},
  etaBadge:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:C.g,borderRadius:20,paddingHorizontal:16,paddingVertical:6,marginTop:12},
  etaDot:{width:6,height:6,borderRadius:3,backgroundColor:'#fff'},
  driverAv:{width:54,height:54,borderRadius:16,backgroundColor:'rgba(192,132,252,0.5)',alignItems:'center',justifyContent:'center'},
  drBtn:{width:42,height:42,borderRadius:12,alignItems:'center',justifyContent:'center'},
  stepOrb:{width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center'},
  halfGhost:{flex:1,padding:13,backgroundColor:'#fff',borderWidth:1.5,borderColor:'#e0d8ef',borderRadius:12,alignItems:'center'},
  mapZone:{height:280,backgroundColor:'#e2edd8',position:'relative'},
  mapTop:{position:'absolute',top:0,left:0,right:0,padding:12,paddingTop:30,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'rgba(255,255,255,0.82)'},
  mtBtn:{width:36,height:36,backgroundColor:'#fff',borderRadius:10,alignItems:'center',justifyContent:'center'},
  truckBub:{backgroundColor:C.p,borderRadius:12,paddingHorizontal:10,paddingVertical:7,flexDirection:'row',alignItems:'center',gap:5},
  sheetHandle:{width:36,height:4,backgroundColor:'#ddd',borderRadius:4,alignSelf:'center',marginBottom:14},
  completeHero:{paddingHorizontal:20,paddingBottom:40,alignItems:'center'},
  completeTitle:{fontSize:22,fontWeight:'700',color:'#fff',marginTop:12,marginBottom:6},
  histHdr:{paddingHorizontal:20,paddingBottom:20},
  histTab:{paddingHorizontal:14,paddingVertical:6,borderRadius:20,backgroundColor:'rgba(255,255,255,0.15)'},
  histSummary:{flexDirection:'row',alignItems:'center',justifyContent:'space-around',backgroundColor:'#fff',marginHorizontal:18,marginTop:-1,borderRadius:16,padding:14,borderWidth:1,borderColor:'rgba(107,59,160,0.1)',marginBottom:4},
  monthLbl:{fontSize:11,fontWeight:'700',color:C.t2,letterSpacing:0.5,textTransform:'uppercase',marginBottom:8,marginTop:4},
  walletHdr:{paddingHorizontal:20,paddingBottom:20},
  walletCard:{borderRadius:18,padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  profileHero:{paddingHorizontal:20,paddingBottom:30},
  profileAv:{width:80,height:80,borderRadius:24,backgroundColor:'rgba(192,132,252,0.4)',alignItems:'center',justifyContent:'center',marginBottom:12,borderWidth:3,borderColor:'rgba(255,255,255,0.25)',position:'relative'},
  profileAvEdit:{position:'absolute',bottom:-4,right:-4,width:22,height:22,backgroundColor:C.amb,borderRadius:7,borderWidth:2,borderColor:'#4a1f88',alignItems:'center',justifyContent:'center'},
  profPill:{gap:5,backgroundColor:'rgba(255,255,255,0.12)',borderRadius:20,paddingHorizontal:12,paddingVertical:5,borderWidth:1,borderColor:'rgba(255,255,255,0.15)'},
  profPillTxt:{fontSize:11,color:'rgba(255,255,255,0.7)'},
  logoutBtn:{width:'100%',padding:14,backgroundColor:'#fff',borderWidth:1.5,borderColor:'#fee2e2',borderRadius:14,alignItems:'center'},
});
